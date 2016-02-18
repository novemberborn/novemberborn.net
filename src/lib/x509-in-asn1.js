import asn1 from 'asn1.js'

// Based on <https://tools.ietf.org/html/rfc5280#appendix-A> with some shortcuts
// (e.g. in the Name definition).

const AlgorithmIdentifier = asn1.define('AlgorithmIdentifier', function () {
  this.seq().obj(
    this.key('algorithm').objid(),
    this.key('parameters').any()
  )
})

const AttributeTypeAndValue = asn1.define('AttributeTypeAndValue', function () {
  this.seq().obj(
    this.key('type').objid(),
    this.key('value').any()
  )
})

const RelativeDistinguishedName = asn1.define('RelativeDistinguishedName', function () {
  this.setof(AttributeTypeAndValue)
})

const Name = asn1.define('Name', function () {
  this.seqof(RelativeDistinguishedName)
})

const Time = asn1.define('Time', function () {
  this.choice({
    utcTime: this.utctime(),
    generalTime: this.gentime()
  })
})

const Validity = asn1.define('Validity', function () {
  this.seq().obj(
    this.key('notBefore').use(Time),
    this.key('notAfter').use(Time)
  )
})

const SubjectPublicKeyInfo = asn1.define('SubjectPublicKeyInfo', function () {
  this.seq().obj(
    this.key('algorithm').use(AlgorithmIdentifier),
    this.key('subjectPublicKey').bitstr()
  )
})

const Extension = asn1.define('Extension', function () {
  this.seq().obj(
    this.key('extnID').objid(),
    this.key('critical').def(false).bool(),
    this.key('extnValue').octstr()
  )
})

const Extensions = asn1.define('Extensions', function () {
  this.seqof(Extension)
})

const TBSCertificate = asn1.define('TBSCertificate', function () {
  this.seq().obj(
    this.key('version').explicit(0).def(0).int({
      0: 'v1',
      1: 'v2',
      2: 'v3'
    }),
    this.key('serialNumber').int(),
    this.key('signature').use(AlgorithmIdentifier),
    this.key('issuer').use(Name),
    this.key('validity').use(Validity),
    this.key('subject').use(Name),
    this.key('subjectPublicKeyInfo').use(SubjectPublicKeyInfo),
    this.key('issuerUniqueID').implicit(1).optional().bitstr(),
    this.key('subjectUniqueID').implicit(2).optional().bitstr(),
    this.key('extensions').explicit(3).optional().use(Extensions)
  )
})

const Certificate = asn1.define('Certificate', function () {
  this.seq().obj(
    this.key('tbsCertificate').use(TBSCertificate),
    this.key('signatureAlgorithm').use(AlgorithmIdentifier),
    this.key('signature').bitstr()
  )
})

export {
  Certificate,
  TBSCertificate
}
