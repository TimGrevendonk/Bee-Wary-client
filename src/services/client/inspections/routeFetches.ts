/**
 * Create a new inspection that queries the route handler in '/api/inspections/route.ts' from the backend.
 * @param {BaseFullInspection} createInspection The full baseFullInspection object to create.
 * @return {FullInspection} response - The Object response from the creation in the form of a FullInspection .
 */
export async function fetchCreateNewInspection(createInspection: BaseFullInspection): Promise<FullInspection> {
    try {  
        const response = await fetch('/api/inspections', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify( createInspection ),
        });
        
        return await response.json();
    } catch (error:any) {
        return error.message;
    }
}