import storyview from "../models/story.views";

export const  incstoryviewCount = async ({storyID}:{storyID:any}) => {
  if(!storyID) return
  const updatedPostCount = await storyview.findOneAndUpdate(
    { storyID: storyID },           // Find by owner ID
    { $inc: { storyviewsCount: 1 } },  // increment by 1
    { new: true }                 // Return the updated document
  );
 return
}