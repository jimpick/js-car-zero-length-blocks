js-car-zero-length-blocks
===

Debugging why @ipld/car is failing with car files that contain zero length files/blocks.

# Usage

```
$ node car-test.mjs
Usage: node car-test.mjs --car-file=true|false --empty-block=true|false
```

# Output

## No empty block, async iterable

Add two normal IPLD blocks. Connect writer async iterable output directly to reader.

```
$ node car-test.mjs --car-file=false --empty-block=false
Use .car file: false
Insert empty block: false
Put cidA CID(bafkreifbfby75yqq7odbski6v2qziwa4xustdzfsg5m5ejpwqbush5rsei) Uint8Array(2) [ 1, 2 ]
Put cidC CID(bafkreiam4okax27swivf2iii5tymg2fakqoh4pcfoa7ykqesdnhk7sbji4) Uint8Array(2) [ 3, 4 ]
Got cidA {
  bytes: Uint8Array(2) [ 1, 2 ],
  cid: CID(bafkreifbfby75yqq7odbski6v2qziwa4xustdzfsg5m5ejpwqbush5rsei)
}
Got cidC {
  bytes: Uint8Array(2) [ 3, 4 ],
  cid: CID(bafkreiam4okax27swivf2iii5tymg2fakqoh4pcfoa7ykqesdnhk7sbji4)
}
```

This works as expected.

## Empty block, async iterable

Add a normal IPLD blocks, then a IPLD block with no data, and finally another
normal IPLD block. Connect writer async iterable output directly to reader.

```
$ node car-test.mjs --car-file=false --empty-block=true
Use .car file: false
Insert empty block: true
Put cidA CID(bafkreifbfby75yqq7odbski6v2qziwa4xustdzfsg5m5ejpwqbush5rsei) Uint8Array(2) [ 1, 2 ]
Put cidB CID(bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku) Uint8Array(0) []
Got cidA {
  bytes: Uint8Array(2) [ 1, 2 ],
  cid: CID(bafkreifbfby75yqq7odbski6v2qziwa4xustdzfsg5m5ejpwqbush5rsei)
}
Got cidB {
  bytes: Uint8Array(0) [],
  cid: CID(bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku)
}
Got cidC undefined WRONG!!
Put cidC CID(bafkreiam4okax27swivf2iii5tymg2fakqoh4pcfoa7ykqesdnhk7sbji4) Uint8Array(2) [ 3, 4 ]
```

This fails. The reader tried to read the third block before it was written, and
got `undefined` as a result.

## No empty block, CAR file

Add two normal IPLD blocks. Write out to a .car file on the filesystem and read it.

```
$ node car-test.mjs --car-file=true --empty-block=false
Use .car file: true
Insert empty block: false
Put cidA CID(bafkreifbfby75yqq7odbski6v2qziwa4xustdzfsg5m5ejpwqbush5rsei) Uint8Array(2) [ 1, 2 ]
Put cidC CID(bafkreiam4okax27swivf2iii5tymg2fakqoh4pcfoa7ykqesdnhk7sbji4) Uint8Array(2) [ 3, 4 ]
Got cidA {
  bytes: Uint8Array(2) [ 1, 2 ],
  cid: CID(bafkreifbfby75yqq7odbski6v2qziwa4xustdzfsg5m5ejpwqbush5rsei)
}
Got cidC {
  bytes: Uint8Array(2) [ 3, 4 ],
  cid: CID(bafkreiam4okax27swivf2iii5tymg2fakqoh4pcfoa7ykqesdnhk7sbji4)
}
```

This works as expected.

## Empty block, CAR file

Add a normal IPLD blocks, then a IPLD block with no data, and finally another
normal IPLD block. Write out to a .car file on the filesystem and read it.

```
$ node car-test.mjs --car-file=true --empty-block=true
Use .car file: true
Insert empty block: true
Put cidA CID(bafkreifbfby75yqq7odbski6v2qziwa4xustdzfsg5m5ejpwqbush5rsei) Uint8Array(2) [ 1, 2 ]
Put cidB CID(bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku) Uint8Array(0) []
Got cidA {
  bytes: Uint8Array(2) [ 1, 2 ],
  cid: CID(bafkreifbfby75yqq7odbski6v2qziwa4xustdzfsg5m5ejpwqbush5rsei)
}
Got cidB {
  bytes: Uint8Array(0) [],
  cid: CID(bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku)
}
Got cidC undefined WRONG!!
Put cidC CID(bafkreiam4okax27swivf2iii5tymg2fakqoh4pcfoa7ykqesdnhk7sbji4) Uint8Array(2) [ 3, 4 ]
```

This also fails. The reader tried to read the third block before it was written, and
got `undefined` as a result.


# License

MIT
