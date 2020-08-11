import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Context as DetailsContext } from '../context/DetailsContext';
const ResolveAuthScreen = () => {
  
  const { getAllfromLocal } = useContext(DetailsContext);
  const history = useHistory();
  useEffect(() => {
    getAllfromLocal(()=>history.push('/home'))
  }, []);

  return null;
};

export default ResolveAuthScreen;
