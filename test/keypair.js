import pqccore from '../src'
import protobuf from 'protobufjs/light'

const { Keypair, Network, Hash } = pqccore
const {Field} = protobuf

function SignatureIO(properties) {
  protobuf.Message.call(this, properties)
}

(SignatureIO.prototype = Object.create(protobuf.Message)).constructor = SignatureIO

Field.d(1, 'bytes')(SignatureIO.prototype, 'd')

describe('Keypair', () => {
  const secret = Hash.sha512('glv')
  const keypair = new Keypair({secret})
  const message = Buffer.from('c825a1ecf2a6830c4401620c3a16f1995057c2ab', 'hex')

  it('should create keypair', function () {
    console.log(keypair.toAddress())
  });

  it('should sign message', function () {
    this.timeout(20 * 1000)
    for (let i = 0; i < 10; ++i) {
      const sig = keypair.sign(message)
      const valid = keypair.verify(message, sig)
      console.log(sig, valid)
    }
  });
})
