import express from 'express';
import BatchLog from '../models/BatchLog.js';
import { protect } from '../middleware/auth.js';
import { DEFAULT_ADDRESS, resolvePlantFields, serializeBatch } from '../utils/plantDefaults.js';

const router = express.Router();

async function syncPlantLicense(licenseNumber) {
  if (!licenseNumber) return;
  await BatchLog.updateMany({}, { $set: { licenseNumber } });
}

// GET /api/batches — public active rows, newest first
router.get('/', async (req, res) => {
  try {
    const batches = await BatchLog.find({ isActive: true }).sort({ manufacturedAt: -1 });
    res.json(batches.map(serializeBatch));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/batches/all — admin (includes inactive)
router.get('/all', protect, async (req, res) => {
  try {
    const batches = await BatchLog.find().sort({ manufacturedAt: -1 });
    res.json(batches.map(serializeBatch));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/batches — admin
router.post('/', protect, async (req, res) => {
  try {
    const {
      productName,
      productSize = '',
      manufacturedAt,
      batchCode = '',
      isActive = true,
      tds = null,
      ph = null,
      calcium = null,
      magnesium = null,
      turbidity = null,
      microbial = '',
    } = req.body;

    if (!productName || !manufacturedAt) {
      return res.status(400).json({ message: 'Product name and manufacture date/time are required' });
    }

    const plant = resolvePlantFields(req.body);

    const batch = await BatchLog.create({
      productName,
      productSize,
      manufacturedAt: new Date(manufacturedAt),
      address: plant.address || DEFAULT_ADDRESS,
      placeOfMfg: plant.placeOfMfg,
      factoryName: plant.factoryName,
      licenseNumber: plant.licenseNumber,
      batchCode,
      isActive,
      tds,
      ph,
      calcium,
      magnesium,
      turbidity,
      microbial,
    });

    await syncPlantLicense(plant.licenseNumber);

    res.status(201).json(serializeBatch(batch));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/batches/:id — admin
router.put('/:id', protect, async (req, res) => {
  try {
    const existing = await BatchLog.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    const plant = resolvePlantFields({
      factoryName: req.body.factoryName !== undefined ? req.body.factoryName : existing.factoryName,
      licenseNumber: req.body.licenseNumber !== undefined ? req.body.licenseNumber : existing.licenseNumber,
      address: req.body.address !== undefined ? req.body.address : existing.address,
      placeOfMfg: req.body.placeOfMfg !== undefined ? req.body.placeOfMfg : existing.placeOfMfg,
    });

    const updates = { ...plant };
    const fields = [
      'productName',
      'productSize',
      'batchCode',
      'isActive',
      'tds',
      'ph',
      'calcium',
      'magnesium',
      'turbidity',
      'microbial',
    ];

    for (const field of fields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }
    if (req.body.manufacturedAt !== undefined) {
      updates.manufacturedAt = new Date(req.body.manufacturedAt);
    }

    const updated = await BatchLog.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { returnDocument: 'after', runValidators: true }
    );

    await syncPlantLicense(plant.licenseNumber);

    res.json(serializeBatch(updated));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/batches/:id — admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const batch = await BatchLog.findById(req.params.id);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    await batch.deleteOne();
    res.json({ message: 'Batch removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
