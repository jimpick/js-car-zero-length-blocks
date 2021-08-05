import fs from 'fs'
import { Readable } from 'stream'
import { CarReader, CarWriter } from '@ipld/car'
import * as raw from 'multiformats/codecs/raw'
import { CID } from 'multiformats/cid'
import { sha256 } from 'multiformats/hashes/sha2'

async function example () {

  // First block
  const bytesA = new Uint8Array([1, 2])
  const hashA = await sha256.digest(raw.encode(bytesA))
  const cidA = CID.create(1, raw.code, hashA)

  // create the writer and set the header with a single root
  const { writer, out } = await CarWriter.create([cidA])

  // Second block
  const bytesB = new Uint8Array(0)
  const hashB = await sha256.digest(raw.encode(bytesB))
  const cidB = CID.create(1, raw.code, hashB)
 
  // Third block
  const bytesC = new Uint8Array([3, 4])
  const hashC = await sha256.digest(raw.encode(bytesC))
  const cidC = CID.create(1, raw.code, hashC)

  // Store blocks
  Readable.from(out).pipe(fs.createWriteStream('example.car'))

  await writer.put({ cid: cidA, bytes: bytesA })
  console.log('cidA', cidA, bytesA)
  await writer.put({ cid: cidB, bytes: bytesB })
  console.log('cidB', cidB, bytesB)
  await writer.put({ cid: cidC, bytes: bytesC })
  console.log('cidC', cidC, bytesC)

  await writer.close()

  const inStream = fs.createReadStream('example.car')
  const reader = await CarReader.fromIterable(inStream)

  const blockA = await reader.get(cidA)
  console.log('retrieved cidA', blockA.bytes)

  const blockB = await reader.get(cidB)
  console.log('retrieved cidB', blockB.bytes)

  const blockC = await reader.get(cidC)
  console.log('retrieved cidC', blockC.bytes)
}

example().catch((err) => {
  console.error(err)
  process.exit(1)
})
