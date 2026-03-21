// Hospital Controller - handles birth and death registrations

const pool = require('../config/db')

// Register a birth
const registerBirth = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      date_of_event,
      place_of_event,
      district,
      province,
      father_name,
      mother_name
    } = req.body

    // Generate certificate number
    const certificate_number = 'BIRTH-' + Date.now()

    const result = await pool.query(
      `INSERT INTO vital_events 
      (event_type, first_name, last_name, date_of_event, place_of_event, 
      district, province, father_name, mother_name, certificate_number, 
      registered_by, status, synced) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) 
      RETURNING *`,
      [
        'birth', first_name, last_name, date_of_event, place_of_event,
        district, province, father_name, mother_name, certificate_number,
        req.user.id, 'completed', true
      ]
    )

    res.json({ 
      message: 'Birth registered successfully!', 
      record: result.rows[0] 
    })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Register a death
const registerDeath = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      date_of_event,
      place_of_event,
      district,
      province,
      cause_of_death
    } = req.body

    // Generate certificate number
    const certificate_number = 'DEATH-' + Date.now()

    const result = await pool.query(
      `INSERT INTO vital_events 
      (event_type, first_name, last_name, date_of_event, place_of_event,
      district, province, cause_of_death, certificate_number, 
      registered_by, status, synced) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) 
      RETURNING *`,
      [
        'death', first_name, last_name, date_of_event, place_of_event,
        district, province, cause_of_death, certificate_number,
        req.user.id, 'completed', true
      ]
    )

    res.json({ 
      message: 'Death registered successfully!', 
      record: result.rows[0] 
    })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Get all vital events registered by this hospital staff
const getRecords = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM vital_events 
      WHERE registered_by = $1 
      ORDER BY created_at DESC`,
      [req.user.id]
    )
    res.json(result.rows)

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Sync offline records
const syncRecords = async (req, res) => {
  try {
    const { records } = req.body

    for (const record of records) {
      const certificate_number = record.event_type.toUpperCase() + '-' + Date.now()

      await pool.query(
        `INSERT INTO vital_events 
        (event_type, first_name, last_name, date_of_event, place_of_event,
        district, province, father_name, mother_name, cause_of_death,
        certificate_number, registered_by, status, synced)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
        [
          record.event_type, record.first_name, record.last_name,
          record.date_of_event, record.place_of_event, record.district,
          record.province, record.father_name, record.mother_name,
          record.cause_of_death, certificate_number,
          req.user.id, 'completed', true
        ]
      )
    }

    res.json({ message: 'Records synced successfully!' })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { registerBirth, registerDeath, getRecords, syncRecords }