import { useRef, useState, useEffect, useCallback} from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import { sortPlacesByDistance } from './loc.js';

function App() {
      const storedIds = JSON.parse(localStorage.getItem('selectedPlace')) || [];
    const storedPlaces = storedIds.map((id) => AVAILABLE_PLACES.find((place) => place.id === id))


 const [modleIsOpen, setModleIsOpen] = useState(false);
  const selectedPlace = useRef();
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);

  const [avalibelPlaces, setAvaliblePlaces] = useState([])


  useEffect(() =>{
    navigator.geolocation.getCurrentPosition((positon) => {
      const sortedPlaces = sortPlacesByDistance(AVAILABLE_PLACES, positon.coords.latitude, positon.coords.longitude)
  
      setAvaliblePlaces(sortedPlaces)
    });
  },[]);



  function handleStartRemovePlace(id) {
    setModleIsOpen(true)
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
   setModleIsOpen(false)
  
}
  
  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    const storedIds = JSON.parse(localStorage.getItem('selectedPlace' )) || [];
  if(storedIds.indexOf(id) === -1) {
  localStorage.setItem("selected palces",JSON.stringify([id,...storedIds]))
  }
  }

  const handleRemovePlace = useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setModleIsOpen(false)

    const storedIds = JSON.parse(localStorage.getItem('selectedPlace' )) || [];
    localStorage.setItem('selectedPlace', JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current)))

  }, [])


  return (
    <>
      <Modal open = {modleIsOpen}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={avalibelPlaces}
          fallbackText="Sorting places by distance...."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
