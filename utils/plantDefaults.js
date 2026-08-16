export const DEFAULT_ADDRESS =
  'Bachcoach, Plot No. 118K, Tilmapur, Ashapur, Varanasi, U.P, 221007';

export const DEFAULT_PLACE = 'Bachcoach';

export const DEFAULT_FACTORY = 'WOWPIO Packaged Drinking Water Plant';

export const DEFAULT_LICENSE = 'FSSAI Licensed';

export function resolvePlantFields(input = {}) {
  const factoryName = String(input.factoryName || '').trim() || DEFAULT_FACTORY;
  const licenseNumber = String(input.licenseNumber || '').trim() || DEFAULT_LICENSE;
  const address = String(input.address || '').trim() || DEFAULT_ADDRESS;
  const placeOfMfg = String(input.placeOfMfg || '').trim() || DEFAULT_PLACE;
  return { factoryName, licenseNumber, address, placeOfMfg };
}

export function serializeBatch(doc) {
  if (!doc) return doc;
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  return { ...obj, ...resolvePlantFields(obj) };
}
