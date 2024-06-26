import { generateDataApiUrl, generateDataSource, generateRequestHeaders } from '@/utils/dataApi';
import { revalidatePath } from 'next/cache';

/**
 * Return a list of all beehive names and their ID.
 * @returns {Promise<{beehiveName[]}>} All beehives their names and IDs.
 */
export async function getAllBeehiveNamesAndIDs(): Promise<{ documents: BeehiveName[] }> {
  try {
    const response = await fetch(generateDataApiUrl('find'), {
      method: 'POST',
      headers: generateRequestHeaders(),
      body: JSON.stringify({
        ...generateDataSource('beehives'),
        projection: {
          _id: 1,
          name: 1,
        },
      }),
    });
    return await response.json();
  } catch (error) {
    throw new Error(`Realm Data API returned an error at getAllBeehiveNamesAndIDs: ${error}`);
  }
}

/**
 * Get a single beehive by its passed ObjectId as string.
 * @param {string} beehiveID - the ObjectId of the beehive to be fetched.
 * @returns {Promise<{beehive}>} - The beehive response object.
 */
export async function getBeehiveByID(beehiveID: string): Promise<{ document: Beehive }> {
  try {
    const response = await fetch(generateDataApiUrl('findOne'), {
      method: 'POST',
      headers: generateRequestHeaders(),
      body: JSON.stringify({
        ...generateDataSource('beehives'),
        filter: {
          _id: { $oid: beehiveID },
        },
      }),
    });
    return await response.json();
  } catch (e) {
    throw new Error(`Realm Data API returned an error: ${e}`);
  }
}

/**
 * Returns a summerized overview of the beehives, preformatted for the home page
 * @returns Summerized overview of hives
 */
export async function getSummerizedBeehives(): Promise<{ documents: SummerizedBeehive[] }> {
  try {
    const response = await fetch(generateDataApiUrl('aggregate'), {
      method: 'POST',
      headers: generateRequestHeaders(),
      body: JSON.stringify({
        ...generateDataSource('beehives'),
        pipeline: [
          {
            $lookup: {
              as: 'last_inspection',
              from: 'inspections',
              foreignField: 'ref_beehive',
              localField: '_id',
              pipeline: [
                {
                  $sort: {
                    last_updated: -1,
                  },
                },
                {
                  $limit: 1,
                },
                {
                  $project: {
                    _id: 0,
                    illness: 1,
                    last_updated: 1,
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              as: 'draft_inspections',
              from: 'inspections',
              foreignField: 'ref_beehive',
              localField: '_id',
              pipeline: [
                {
                  $match: {
                    draft: true,
                  },
                },
                {
                  $sort: {
                    last_updated: -1,
                  },
                },
                {
                  $limit: 1,
                },
                {
                  $project: {
                    _id: 1,
                    title: 1,
                    last_updated: 1,
                    draft: 1,
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              from: 'sensors',
              localField: 'sensor_ref',
              foreignField: 'metadata.sensorId',
              as: 'last_sensor_entry',
              pipeline: [
                {
                  $sort: {
                    timestamp: -1,
                  },
                },
                {
                  $limit: 1,
                },
                {
                  $project: {
                    _id: 0,
                    timestamp: 1,
                    'metadata.sensorId': 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: '$last_inspection',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $unwind: {
              path: '$last_sensor_entry',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              name: 1,
              location: 1,
              last_inspection: 1,
              last_sensor_entry: 1,
              draft_inspections: {
                $cond: {
                  if: {
                    $ne: ['$draft_inspections', []],
                  },
                  then: '$draft_inspections',
                  else: '$$REMOVE',
                },
              },
              creation_date: 1,
            },
          },
        ],
      }),
    });
    return await response.json();
  } catch (e) {
    throw new Error(`Realm Data API returned an error: ${e}`);
  }
}

export async function getSummerizedBeehiveByID(beehiveID: string): Promise<{ documents: SummerizedBeehive[] }> {
  try {
    const response = await fetch(generateDataApiUrl('aggregate'), {
      method: 'POST',
      headers: generateRequestHeaders(),
      body: JSON.stringify({
        ...generateDataSource('beehives'),
        pipeline: [
          {
            $match: {
              _id: { $oid: beehiveID },
            },
          },
          {
            $lookup: {
              as: 'last_inspection',
              from: 'inspections',
              foreignField: 'ref_beehive',
              localField: '_id',
              pipeline: [
                {
                  $sort: {
                    last_updated: -1,
                  },
                },
                {
                  $limit: 1,
                },
                {
                  $project: {
                    _id: 0,
                    illness: 1,
                    last_updated: 1,
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              as: 'draft_inspections',
              from: 'inspections',
              foreignField: 'ref_beehive',
              localField: '_id',
              pipeline: [
                {
                  $match: {
                    draft: true,
                  },
                },
                {
                  $sort: {
                    last_updated: -1,
                  },
                },
                {
                  $limit: 1,
                },
                {
                  $project: {
                    _id: 1,
                    title: 1,
                    last_updated: 1,
                    draft: 1,
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              from: 'sensors',
              localField: 'sensor_ref',
              foreignField: 'metadata.sensorId',
              as: 'last_sensor_entry',
              pipeline: [
                {
                  $sort: {
                    timestamp: -1,
                  },
                },
                {
                  $limit: 1,
                },
                {
                  $project: {
                    _id: 0,
                    timestamp: 1,
                    'metadata.sensorId': 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: '$last_inspection',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $unwind: {
              path: '$last_sensor_entry',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              name: 1,
              location: 1,
              last_inspection: 1,
              last_sensor_entry: 1,
              draft_inspections: {
                $cond: {
                  if: {
                    $ne: ['$draft_inspections', []],
                  },
                  then: '$draft_inspections',
                  else: '$$REMOVE',
                },
              },
              creation_date: 1,
            },
          },
        ],
      }),
    });
    return await response.json();
  } catch (e) {
    throw new Error(`Realm Data API returned an error: ${e}`);
  }
}

/**
 * Create a new beehive.
 * @param {BaseBeehive} beehive - the beehive to be created.
 * @returns {Promise<{beehive}>} - The beehive response object.
 */
export async function createBeehive(
  {name, location, material, frames, queen, creation_date, sensor_ref}: BaseBeehive
): Promise<{ document: Beehive }> {
  try {
    const _documentContent: any = {
      "name": name,
      "location": {
        type: "Point",
        coordinates: location.coordinates
      },
      "material": material,
      "frames": frames,
      "queen": {
        "creationDate": {
          "$date": queen.creationDate
        },
        "markingDescription": queen.markingDescription
      },
      "creation_date": {
        "$date": creation_date
      }
    }

    if (sensor_ref) {
      _documentContent.sensor_ref = { "$oid": sensor_ref };
    }        

    const response = await fetch(generateDataApiUrl('insertOne'), {
      method: 'POST',
      headers: generateRequestHeaders(),
      body: JSON.stringify({
        ...generateDataSource('beehives'),
        "document": {
          ..._documentContent
        }
      }),
    });
    revalidatePath("/")    

    return await response.json();
  } catch (e) {
    throw new Error(`Realm Data API returned an error in createBeehive: ${e}`);
  }
}


/**
 * Update a beehive found by its ID.
 * @param {BaseBeehive} beehive - the beehive to be created.
 * @returns {Promise<{beehive}>} - The beehive response object.
 */
export async function updateBeehiveByBeehiveID(
  beehiveID : String, 
  {name, location, material, frames, queen, creation_date, sensor_ref}: BaseBeehive
): Promise<{ document: Beehive }> {
  try {
    const _documentContent: any = {
      "name": name,
      "location": {
        type: "Point",
        coordinates: location.coordinates
      },
      "material": material,
      "frames": 
        frames.map((frame: { title: string, id?: string }) => (
          {
            "title": frame.title,
            ...(frame.id && { "id": { "$oid": frame.id } })
          }
        )),
      "queen": {
        "creationDate": {
          "$date": queen.creationDate
        },
        "markingDescription": queen.markingDescription
      },
      "creation_date": {
        "$date": creation_date
      }
    }

    if (sensor_ref) {
      _documentContent.sensor_ref = { "$oid": sensor_ref };
    }        

    const response = await fetch(generateDataApiUrl('updateOne'), {
      method: 'POST',
      headers: generateRequestHeaders(),
      body: JSON.stringify({
        ...generateDataSource('beehives'),
        filter: {
          _id: { "$oid": beehiveID }
        },
        update: {
          "$set": {
            ..._documentContent
          }
        },
        upsert: false
      }),
    });
    revalidatePath("/")
    revalidatePath(`/beehives/manage/${beehiveID}`)    
    return await response.json();
  } catch (e) {
    throw new Error(`Realm Data API returned an error in updateBeehiveByBeehiveID: ${e}`);
  }
}


/**
 * Delete a single beehive.
 * @returns the amount deleted items from the database.
 */
export async function DeleteBeehiveByBeehiveID(
  beehiveID : String, 
): Promise<{ document: string }> {
  try {    
    const response = await fetch(generateDataApiUrl("deleteOne"), {
      method: "POST",
      headers: generateRequestHeaders(),
      body: JSON.stringify({
        ...generateDataSource("beehives"),
        filter: {
          _id: { "$oid": beehiveID }
        }
      })
    })
    revalidatePath("/")
    return await response.json();
    
  } catch ( error ) {
    throw new Error(`Realm Data API returned an error on DeleteBeehiveByBeehiveID: ${ error }`) 
  }
}
