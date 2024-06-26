import { createNewInspection, UpdateInspectionByInspectionID, DeleteInspectionByInspectionID } from '@/services/server/inspections/queries';

/**
 * catches any API route resuest with the correct handler and signature parameters.
 * the incomming pre-cast request is passed to queries in its corresopong 'services/??/queries.ts' file.
 */

/**
 * Post a new BaseFullInspection to the database.
 * @param request A JSON stringified Objecct of a BaseFullInspection
 * @returns The the created Fullinspection with _id.
 */
export async function POST(request: Request): Promise<Response> {
    const baseFullInspectionContent: BaseFullInspection = await request.json();  
    
    const insertedID = (await createNewInspection(baseFullInspectionContent));
    
    return Response.json( insertedID )
}

/**
 * update a  BaseFullInspection in the database.
 * @param request A JSON stringified Objecct of a BaseFullInspection
 * @returns The the updated Fullinspection with _id.
 */
export async function PATCH(request: Request): Promise<Response> {
    const _InspectionContent = await request.json();
    const _InspectionID: String = _InspectionContent.inspectionID;
    const _InspectionBody: BaseFullInspection = _InspectionContent.createInspection;  
    
    
    const updatedID = (await UpdateInspectionByInspectionID(_InspectionID, _InspectionBody));
    
    return Response.json(updatedID)
}

/**
 * Post a new BaseFullInspection to the database.
 * @param request A JSON stringified inspectionID of string
 * @returns The the created Fullinspection with _id.
 */
export async function DELETE(request: Request): Promise<Response> {
    const _InspectionID = await request.json();
    const insertedID = (await DeleteInspectionByInspectionID(_InspectionID));
    
    return Response.json(insertedID)
}