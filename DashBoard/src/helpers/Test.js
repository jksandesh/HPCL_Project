const { MerkleTree } = require('merkletreejs')
const SHA256 = require('crypto-js/sha256')
const { Wallet } = require('@/helpers/near-wallet')
const leaves = ['a', 'b', 'c', 'd', 'e'].map(x => SHA256(x))
const tree = new MerkleTree(leaves, SHA256)
const root = tree.getRoot().toString('hex')

const leaf1 = SHA256('a')
const leaf2 = SHA256('b')
const leaf3 = SHA256('c')
const proof1 = tree.getProof(leaf1)
const proof2 = tree.getProof(leaf2)
const proof3 = tree.getProof(leaf3)
const proof11 = tree.getPositionalHexProof(leaf1)
const proof12 = tree.getPositionalHexProof(leaf2)
const proof13 = tree.getPositionalHexProof(leaf3)

// function getB64Fields (array) {
//   const b64Arrray = []
//   for (let i = 0; i < array.length; i++) {
//     const b64obj = {}
//     console.log(array[i])
//     for (const k in array[i]) {
//       console.log(k)
//       b64obj[k === 'right' ? 'r' : 'l'] = Buffer.from(array[i][k], 'hex').toString('base64')
//     }
//     console.log(b64obj)
//     b64Arrray.push(b64obj)
//   }
//   return b64Arrray
// }

console.log(tree.verify(proof1, leaf1, root)) // true
console.log(tree.verify(proof2, leaf2, root)) // true
console.log(tree.verify(proof3, leaf3, root)) // true
console.log(tree.verify(proof11, leaf1, root)) // true
console.log(tree.verify(proof12, leaf2, root)) // true
console.log(tree.verify(proof13, leaf3, root)) // true

var temp = JSON.stringify(proof11)
console.log(temp)
console.log(tree.print())

var temp2 = JSON.parse('[[1,"0x3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d"],[1,"0xbffe0b34dba16bc6fac17c08bac55d676cded5a4ade41fe2c9924a5dde8f3e5b"],[1,"0x3f79bb7b435b05321651daefd374cdc681dc06faa65e374e38337b88ca046dea"]]')
console.log(tree.verify(temp2, leaf1, root)) // true

const wallet = new Wallet({ createAccessKeyFor: 'zupple_hpcl.near' })
callNear()

async function callNear () {
  const isSignedIn = await wallet.startUp()
  if (isSignedIn) {
    console.log('YESSSS')
    console.log('Here-->' + await wallet.callMethod({ method: 'set_hash', args: { hash: root }, contractId: 'zupple_hpcl.near' }))
    // console.log(await wallet.viewMethod({ method: 'get_hash', args: { hash: 'Sandesh' }, contractId: 'hpcl.testnet' }))
    console.log(await wallet.viewMethod({ method: 'get_all_hashes', contractId: 'zupple_hpcl.near' }))
  } else {
    console.log('NOOOOO')
    const accounts = await wallet.signIn({ contractId: 'zupple_hpcl.near' })
    console.log(accounts)
  }
}
