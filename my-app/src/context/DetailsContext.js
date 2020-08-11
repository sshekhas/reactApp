import createDataContext from './createDataContext';



const detailsReducer = (state, action) => {
  switch (action.type) {
    case 'add_details':
      return { ...state, personal: action.payload.personal?action.payload.personal:0, date: action.payload.date, income: action.payload.income, retirement: action.payload.retirement, dependent: action.payload.dependent, relation:action.payload.relation, depIncome: action.payload.depIncome  };
    
    default:
      return state;
  }
};
const getAllfromLocal = dispatch => {
  return (callback) => {
   
    const newlist = {
      date: localStorage.getItem('date'),
      income:localStorage.getItem('income'),
      retirement:localStorage.getItem('retirement'),        
      dependent:localStorage.getItem('dependent'),
      relation:localStorage.getItem('relation'),
      depIncome:localStorage.getItem('depIncome'),
      personal:Number(localStorage.getItem('personal'))
  
  }
   dispatch({
      type: 'add_details', payload: newlist
    })
    console.log(localStorage.getItem('date'))
    console.log(typeof localStorage.getItem('date'))
    
    callback();
  }
  
}
   
const addTolocalStorage = dispatch => {
  return (date, income, retirement, dependent, relation, depIncome, personal,callback) => {
    dispatch({
      type: 'add_details', payload: {
        date,
        income,
        retirement,
        dependent,
        relation,
        depIncome,
        personal
      }
    })

    if(date){localStorage.setItem( 'date', date )}
    
    if(income){localStorage.setItem('income', income  )}
    
    if(retirement) {localStorage.setItem( 'retirement', retirement )}
    
    if(dependent)
    {localStorage.setItem( 'dependent', dependent )}
    if(relation)
    {localStorage.setItem( 'relation', relation )}
    if(depIncome)
    {localStorage.setItem( 'depIncome' , depIncome )}
    if(personal)
    {localStorage.setItem( 'personal', personal )}
     
    callback()
    const data = localStorage.getItem('personal');
    console.log(data)
    
  };
}

export const { Provider, Context } = createDataContext(
  detailsReducer,
  { addTolocalStorage, getAllfromLocal },
  { investment: 0.5, expenses: 0.80, lifestyle: 0.6, personal: 0, date: '', income: '', retirement: '', dependent: '', relation: '', depIncome: '' }
);
