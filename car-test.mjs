import fs from 'fs'
import { Readable } from 'stream'
import { CarReader, CarWriter } from '@ipld/car'
import * as raw from 'multiformats/codecs/raw'
import { CID } from 'multiformats/cid'
import { sha256 } from 'multiformats/hashes/sha2'
import delay from 'delay'
import minimist from 'minimist'

const argv = minimist(process.argv.slice(2))

if (
  !(
    (argv['car-file'] === 'true' || argv['car-file'] === 'false') && 
    (argv['empty-block'] === 'true' || argv['empty-block'] === 'false')
  )
) {
  console.log(`Usage: node car-test.mjs --car-file=true|false --empty-block=true|false`)
  process.exit(1)
}

const carFile = argv['car-file'] === 'true'
const emptyBlock = argv['empty-block'] === 'true'

console.log('Use .car file:', carFile)
console.log('Insert empty block:', emptyBlock)

async function run () {

  try {

    // Data - First block
    const bytesA = new Uint8Array([1, 2])
    const hashA = await sha256.digest(raw.encode(bytesA))
    const cidA = CID.create(1, raw.code, hashA)

    // Data - Middle block (optional)
    const bytesB = new Uint8Array(0)
    const hashB = await sha256.digest(raw.encode(bytesB))
    const cidB = CID.create(1, raw.code, hashB)
   
    // Data - Last block
    const bytesC = new Uint8Array([3, 4])
    const hashC = await sha256.digest(raw.encode(bytesC))
    const cidC = CID.create(1, raw.code, hashC)

    // create the writer and set the header with a single root
    const { writer, out } = await CarWriter.create([])

    async function write () {
      if (carFile) {
        Readable.from(out).pipe(fs.createWriteStream('example.car'))
      }

      writer.put({ cid: cidA, bytes: bytesA })
      console.log('Put cidA', cidA, bytesA)
      await delay(1000)

      if (emptyBlock) {
        writer.put({ cid: cidB, bytes: bytesB })
        console.log('Put cidB', cidB, bytesB)
        await delay(1000)
      }

      writer.put({ cid: cidC, bytes: bytesC })
      console.log('Put cidC', cidC, bytesC)
      await delay(1000)

      writer.close()
    }

    async function read () {
      let reader

      if (carFile) {
        await delay(1000)
        const inStream = fs.createReadStream('example.car')
        reader = await CarReader.fromIterable(inStream)
      } else {
        reader = await CarReader.fromIterable(out)
      }

      const blockA = await reader.get(cidA)
      console.log('Got cidA', blockA)

      if (emptyBlock) {
        const blockB = await reader.get(cidB)
        console.log('Got cidB', blockB)
      }

      const blockC = await reader.get(cidC)
      console.log('Got cidC', blockC, blockC === undefined ? 'WRONG!!' : '')
    }

    read()
    write()
  } catch (e) {
    console.error('Exception', e)
  }
}

run()
