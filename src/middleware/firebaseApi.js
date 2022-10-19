import { database } from '../firebase.config'
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'

export function firebaseApi() {
  const eventsCollectionRef = collection(database, "events")

  const getAllItems = async () => {
    const data = await getDocs(eventsCollectionRef)
    return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
  }

  const createItem = async (event) => {
    await addDoc(eventsCollectionRef, event)
    console.log("item created")
    return event
  }

  const updateItem = async (event) => {
    const userDoc = doc(database, "events", event.id)
    await updateDoc(userDoc, event)
    console.log("item updated")
    return event
  }

  const deleteItem = async (id) => {
    const userDoc = doc(database, "events", id);
    await deleteDoc(userDoc);
    console.log("item deleted")
  }

  return {
    getAllItems,
    createItem,
    updateItem,
    deleteItem
  }
}