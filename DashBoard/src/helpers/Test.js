const { MerkleTree } = require('merkletreejs')
const SHA256 = require('crypto-js/sha256')
const leaves = ['a', 'b', 'c'].map(x => SHA256(x))
const tree = new MerkleTree(leaves, SHA256)
const root = tree.getRoot().toString('hex')
const leaf = SHA256('a')
const proof = tree.getProof(leaf)

function getB64Fields (array) {
  const b64Arrray = []
  for (let i = 0; i < array.length; i++) {
    const b64obj = {}
    for (const k in array[i]) {
      b64obj[k === 'right' ? 'r' : 'l'] = Buffer.from(array[i][k], 'hex').toString('base64')
    }
    b64Arrray.push(b64obj)
  }
  return b64Arrray
}

// console.log(proof)
console.log(tree.verify(proof, leaf, root)) // true
// var p2 = JSON.parse('[{"position":"right","data":{"type":"Buffer","data":[62,35,232,22,0,57,89,74,51,137,79,101,100,225,177,52,139,189,122,0,136,212,44,74,203,115,238,174,213,156,0,157]}},{"position":"right","data":{"type":"Buffer","data":[46,125,44,3,169,80,122,226,101,236,245,181,53,104,133,165,51,147,162,2,157,36,19,148,153,114,101,161,162,90,239,198]}}]')
// console.log(tree.verify(p2, leaf, root))

console.log(getB64Fields(tree.getProof(leaf)))
// console.log(JSON.stringify(proof))
// console.log(JSON.parse(JSON.stringify(proof)))
