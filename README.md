js-car-zero-length-blocks
===

Debugging why @ipld/car is failing with car files that contain zero length files/blocks.

# Usage

```
$ node car-test.mjs
Usage: node car-test.mjs --empty-block=true|false --car-file=true|false [--skip-write]
```

# Output

## No empty block, async iterable

Add two normal IPLD blocks. Connect writer async iterable output directly to reader.

```
$ node car-test.mjs --empty-block=false --car-file=false 
Insert empty block: false
Use .car file: false

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
$ node car-test.mjs --empty-block=true --car-file=false 
Insert empty block: true
Use .car file: false

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
$ node car-test.mjs --empty-block=false --car-file=true
Insert empty block: false
Use .car file: true
Filename: example.car
Skip write: false

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

A file named `example.car` was written to the filesystem. Let's try re-reading that
(skip the writing phase).

```
$ node car-test.mjs --empty-block=false --car-file=true --skip-write
Insert empty block: false
Use .car file: true
Filename: example.car
Skip write: true

Got cidA {
  bytes: Uint8Array(2) [ 1, 2 ],
  cid: CID(bafkreifbfby75yqq7odbski6v2qziwa4xustdzfsg5m5ejpwqbush5rsei)
}
Got cidC {
  bytes: Uint8Array(2) [ 3, 4 ],
  cid: CID(bafkreiam4okax27swivf2iii5tymg2fakqoh4pcfoa7ykqesdnhk7sbji4)
}
```

This is the same correct result as before.

## Empty block, CAR file

Add a normal IPLD blocks, then a IPLD block with no data, and finally another
normal IPLD block. Write out to a .car file on the filesystem and read it.

```
$ node car-test.mjs  --empty-block=true --car-file=true
Insert empty block: true
Use .car file: true
Filename: example-empty.car
Skip write: false

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

A file named `example-empty.car` was written to the filesystem. Let's try re-reading that
(skip the writing phase).

```
$ node car-test.mjs --empty-block=true --car-file=true --skip-write
Insert empty block: true
Use .car file: true
Filename: example-empty.car
Skip write: true

Got cidA {
  bytes: Uint8Array(2) [ 1, 2 ],
  cid: CID(bafkreifbfby75yqq7odbski6v2qziwa4xustdzfsg5m5ejpwqbush5rsei)
}
Got cidB {
  bytes: Uint8Array(0) [],
  cid: CID(bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku)
}
Got cidC {
  bytes: Uint8Array(2) [ 3, 4 ],
  cid: CID(bafkreiam4okax27swivf2iii5tymg2fakqoh4pcfoa7ykqesdnhk7sbji4)
}
```

Interesting! It read the .car file correctly. The incorrect result only seems to
happen when the file is being read at the same time as it is written.


# License

MIT
