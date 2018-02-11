import crypto from 'crypto'
import BufferUtil from '../util/buffer'
import $ from '../util/preconditions'

const Hash = {}

Hash.sha1 = function (buf) {
  $.checkArgument(BufferUtil.isBuffer(buf));
  return crypto.createHash('sha1').update(buf).digest();
};

Hash.sha1.blocksize = 512;

Hash.sha256 = function (buf) {
  $.checkArgument(BufferUtil.isBuffer(buf));
  return crypto.createHash('sha256').update(buf).digest();
};

Hash.sha256.blocksize = 512;

Hash.sha256sha256 = function (buf) {
  $.checkArgument(BufferUtil.isBuffer(buf));
  return Hash.sha256(Hash.sha256(buf));
};

Hash.ripemd160 = function (buf) {
  $.checkArgument(BufferUtil.isBuffer(buf));
  return crypto.createHash('ripemd160').update(buf).digest();
};

Hash.sha256ripemd160 = function (buf) {
  $.checkArgument(BufferUtil.isBuffer(buf));
  return Hash.ripemd160(Hash.sha256(buf));
};

Hash.sha512 = function (buf) {
  $.checkArgument(BufferUtil.isBuffer(buf));
  return crypto.createHash('sha512').update(buf).digest();
};

Hash.sha512.blocksize = 1024;

Hash.hmac = function (hashf, data, key) {
  // http://en.wikipedia.org/wiki/Hash-based_message_authentication_code
  // http://tools.ietf.org/html/rfc4868#section-2
  $.checkArgument(BufferUtil.isBuffer(data));
  $.checkArgument(BufferUtil.isBuffer(key));
  $.checkArgument(hashf.blocksize);

  const blocksize = hashf.blocksize / 8;

  if (key.length > blocksize) {
    key = hashf(key);
  } else if (key < blocksize) {
    const fill = new Buffer(blocksize);
    fill.fill(0);
    key.copy(fill);
    key = fill;
  }

  const o_key = new Buffer(blocksize);
  o_key.fill(0x5c);

  const i_key = new Buffer(blocksize);
  i_key.fill(0x36);

  const o_key_pad = new Buffer(blocksize);
  const i_key_pad = new Buffer(blocksize);
  for (let i = 0; i < blocksize; i++) {
    o_key_pad[i] = o_key[i] ^ key[i];
    i_key_pad[i] = i_key[i] ^ key[i];
  }

  return hashf(Buffer.concat([o_key_pad, hashf(Buffer.concat([i_key_pad, data]))]));
};

Hash.sha256hmac = function (data, key) {
  return Hash.hmac(Hash.sha256, data, key);
};

Hash.sha512hmac = function (data, key) {
  return Hash.hmac(Hash.sha512, data, key);
};

export default Hash