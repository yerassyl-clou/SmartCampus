import { limits } from '../courses/fixtureWorkspace.js'

const formats = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

// Named synthetic test files exercise parser and lease outcomes without contacting Storage.
const scenarios = {
  'fixture-scanned.pdf': 'scanned',
  'fixture-encrypted.pdf': 'encrypted',
  'fixture-expired.pdf': 'expiredUpload',
  'fixture-interrupted.pdf': 'interrupted',
}

export function validateFile(file) {
  const ext = file.name.split('.').pop().toLowerCase()
  if (!file.name.includes('.') || !Object.hasOwn(formats, ext) || (file.type && file.type !== formats[ext])) return 'invalidType'
  if (file.size === 0 || file.size > limits.fileBytes) return 'invalidSize'
  return null
}

const pause = () => new Promise(resolve => setTimeout(resolve, 180))

export async function uploadFixture(transfer, {signal, onProgress, onProcessing}) {
  const {file} = transfer
  while (transfer.offset < file.size) {
    await pause()
    signal.throwIfAborted()
    const end = Math.min(file.size, transfer.offset + limits.chunkBytes)
    await file.slice(transfer.offset, end).arrayBuffer()
    signal.throwIfAborted()
    transfer.offset = end
    onProgress(end)
    if (end < file.size && scenarios[file.name] === 'interrupted' && !transfer.interrupted) {
      transfer.interrupted = true
      return {reason:'interrupted'}
    }
  }
  if (scenarios[file.name] === 'expiredUpload' && !transfer.expired) {
    transfer.expired = true
    transfer.offset = 0
    return {reason:'expiredUpload'}
  }
  onProcessing()
  await pause()
  signal.throwIfAborted()
  const buffer = await file.arrayBuffer()
  const header = new Uint8Array(buffer, 0, Math.min(5, buffer.byteLength))
  const isPdf = file.name.toLowerCase().endsWith('.pdf')
  const signature = isPdf ? [37, 80, 68, 70, 45] : [80, 75, 3, 4]
  if (!signature.every((byte, index) => header[index] === byte)) return {reason:'corrupt'}
  const reason = scenarios[file.name]
  if (['scanned', 'encrypted'].includes(reason)) return {reason}
  const digest = await crypto.subtle.digest('SHA-256', buffer)
  signal.throwIfAborted()
  return {hash:Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2,'0')).join('')}
}
