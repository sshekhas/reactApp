import React, { useContext, useReducer, useState, useEffect } from 'react';
import UseWindowDimensions from '../hooks/useWindowDimensions'
import Profile from '../components/profile'
import './form.css'
import moment from 'moment';
import Calendar from 'react-calendar';
import { useHistory } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';

import { Context as DetailsContext } from '../context/DetailsContext';

const reducer1 = (state, action) => {
    switch (action.type) {
        case 'remove_inc_err':

            return { ...state, income: '' };
        case 'add_inc_err':

            return { ...state, income: 'Please enter only alphabets and digits' };
        case 'add_ret_err':

            return { ...state, retirement: 'Please enter age ranging 30 to 70' };
        case 'remove_ret_err':

            return { ...state, retirement: '' };
        case 'remove_depn_err':

            return { ...state, dependent: '' };
        case 'add_depn_err':

            return { ...state, dependent: 'Please enter no. from 0 to 8' };

        case 'remove_relation_err':

            return { ...state, relation: '' };
        case 'add_relation_err':

            return { ...state, relation: 'Please Enter mother father child or spouse' };
        case 'remove_depinc_err':

            return { ...state, depIncome: '' };
        case 'add_depinc_err':

            return { ...state, depIncome: 'Please enter only digits' };
        default: return state;
    }
};




const today = new Date();


const maxdate = new Date(moment(today).subtract(18, 'years').format('MM/DD/YYYY'));
const mindate = new Date(moment(today).subtract(60, 'years').format('MM/DD/YYYY'));

const FormScreen = () => {

    const history = useHistory();
    const { height, width } = UseWindowDimensions();
    const [showDate, setShowdate] = useState(false)
    const [errState, errdispatch] = useReducer(reducer1, { date: '', income: '', retirement: '', dependent: '', relation: '', depIncome: '' })
    const { state, addTolocalStorage } = useContext(DetailsContext);
  
  
    const [date, setDate] = useState(state.date?state.date:'')
    
    const [income, setincome] = useState(state.income?state.income:'')
    
    const [retirement, setretirement] = useState(state.retirement?state.retirement:'')
    const [dependent, setDependent] = useState(state.dependent?state.dependent:'')
    const [relation, setRelation] = useState(state.relation?state.relation:'')
    const [depIncome, setdepIncome] = useState(state.depIncome?state.depIncome:'')
    const [count, setCount] = useState(state.personal*6);
    const [counted, setCounted] = useState({ date: state.date?true:false, 
      income: state.income?true:false, 
      retirement: state.retirement?true:false,
       dependent: state.dependent?true:false, 
       relation: state.relation?true:false, 
       depIncome: state.depIncome?true:false })
    
    const handleSubmit = () => {
        if(!(errState.date || errState.income || errState.retirement || errState.dependent || errState.relation || errState.depIncome))
        {console.log("being submited")
            addTolocalStorage(date, income, retirement, dependent, relation, depIncome, count / 6, () => history.push('/home'))}
        else{console.log("submit cancle")}
    }

    const percentage = `${Math.round(count * 100 / 6)}%`
    return (
        <div style={{ flex: 1, height: height *1.2, position: "relative", top: 0, backgroundColor: '#dedcdc' }}>
            <div style={{ position: 'relative', height: height*0.5 }}>

                <Profile
                    name={'Goal teller'}
                    location={'Bangalore, India'}
                    prefix={'You completed'}
                    postfix='of Personal details'
                    percentage={percentage}
                    val={count / 6}
                    header='true'
                    Margin={10} />
            </div>

            <div className='formContainer' style={{ width: width * 0.60, marginLeft: width * 0.19, marginRight: width * 0.20 }}>
                <div className='formHeading' style={{ height: 60 }}>
                    <h4>Personal details</h4>

                </div>
                <form onSubmit={handleSubmit}>
                    <div className='formComponent'>

                        {showDate == false ? <div onClick={() => setShowdate(true)} className="input" style={{ width: '100%', height: 40 }}>
                            {date ? <p className='placeholder'>{date}</p> : <p className='placeholder'>Date of birth</p>}
                        </div> :
                            <Calendar
                                className='calender'
                                onChange={(val) => {
                                    setDate(moment(val).format('MM/DD/YYYY'));
                                    if (!counted.date) {
                                        setCount(count + 1);
                                        setCounted({ ...counted, date: true })
                                    }
                                    setShowdate(!showDate)
                                }}
                                value={date ? new Date(date) : maxdate}
                                minDate={mindate}
                                maxDate={maxdate}
                            />
                        }
                    </div>
                    <div className='formComponent'>

                        <input type="text"
                            value={income}
                            onInput={(e) => {
                                setincome(e.target.value)
                            }}
                            onChange={(e) => {
                                // setincome(e.target.value)
                                const { value } = e.target

                                if (value) {
                                    const rx = /^[a-zA-Z0-9]*$/;
                                    if (rx.test(value)) {
                                        errdispatch({ type: 'remove_inc_err' })
                                        if (!counted.income) {
                                            setCount(count + 1);
                                            setCounted({ ...counted, income: true })
                                        }
                                    }
                                    else {
                                        errdispatch({ type: 'add_inc_err' })

                                        if (counted.income) {
                                            setCount(count - 1);
                                            setCounted({ ...counted, income: false })
                                        }
                                    }
                                }
                                else {
                                    if (errState.income)
                                        errdispatch({ type: 'remove_inc_err' })
                                    if (counted.income) {
                                        setCount(count - 1);
                                        setCounted({ ...counted, income: false })
                                    }
                                }
                            }
                            }
                            placeholder="Source of income"
                            className={errState.income ? ' showError' : 'text'}
                            style={{ width: '100%', height: 40 }} />
                        {errState.income &&
                            <div style={{ color: "red", paddingBottom: 10 }}>{errState.income}</div>
                        }

                    </div>
                    <div className='formComponent'>

                        <input type="text"
                            value={retirement}
                            onInput={(e) => {
                                setretirement(e.target.value)
                            }}
                            onChange={(e) => {

                                const { value } = e.target
                                if (value) {
                                    const rx = /([3-6][0-9]|70)/
                                    if (rx.test(value)) {

                                        errdispatch({ type: 'remove_ret_err' })
                                        if (!counted.retirement) {
                                            setCount(count + 1);
                                            setCounted({ ...counted, retirement: true })
                                        }
                                    }
                                    else {
                                        errdispatch({ type: 'add_ret_err' })

                                        if (counted.retirement) {
                                            setCount(count - 1);
                                            setCounted({ ...counted, retirement: false })
                                        }
                                    }
                                } else {
                                    if (errState.retirement)
                                        errdispatch({ type: 'remove_ret_err' })
                                    if (counted.retirement) {
                                        setCount(count - 1);
                                        setCounted({ ...counted, retirement: false })
                                    }
                                }

                            }}
                            placeholder="Retirement age"
                            className={errState.retirement ? ' showError' : 'text'}
                            style={{ width: '100%', height: 40 }} />
                        {errState.retirement &&
                            <div style={{ color: "red", paddingBottom: 10 }}>{errState.retirement}</div>
                        }
                    </div>
                    <div className='formComponent'>

                        <input type="text"
                            value={dependent}
                            onInput={(e) => {
                                setDependent(e.target.value)
                            }}
                            onChange={(e) => {
                                const { value } = e.target
                                if (value) {
                                    const rx = /(^[0-8]$)/;
                                    if (rx.test(value)) {
                                        errdispatch({ type: 'remove_depn_err' })
                                        if (!counted.dependent) {
                                            setCount(count + 1);
                                            setCounted({ ...counted, dependent: true })
                                        }
                                    }
                                    else {
                                        errdispatch({ type: 'add_depn_err' })

                                        if (counted.depIncome) {
                                            setCount(count - 1);
                                            setCounted({ ...counted, dependent: false })
                                        }
                                    }
                                } else {
                                    if (errState.dependent)
                                        errdispatch({ type: 'remove_depn_err' })
                                    if (counted.dependent) {
                                        setCount(count - 1);
                                        setCounted({ ...counted, dependent: false })
                                    }
                                }
                            }}
                            placeholder="No of dependent"
                            className={errState.dependent ? ' showError' : 'text'}
                            style={{ width: '100%', height: 40 }} />
                        {errState.dependent &&
                            <div style={{ color: "red", paddingBottom: 10 }}>{errState.dependent}</div>
                        }
                    </div>
                    <div className='formComponent'>

                        <input type="text"
                            value={relation}
                            onInput={(e) => {
                                setRelation(e.target.value)
                            }}
                            onChange={(e) => {
                                const { value } = e.target
                                if (value) {
                                    const rx = /^mother$|^father$|^child$|^spouse$|^$/;

                                    if (rx.test(value.toLowerCase())) {

                                        errdispatch({ type: 'remove_relation_err' })
                                        if (!counted.relation) {
                                            setCount(count + 1);
                                            setCounted({ ...count, relation: true })
                                        }
                                    }
                                    else {

                                        errdispatch({ type: 'add_relation_err' })

                                        if (counted.relation) {
                                            setCount(count - 1);
                                            setCounted({ ...count, relation: false })
                                        }
                                    }
                                } else {
                                    if (errState.relation)
                                        errdispatch({ type: 'remove_relation_err' })
                                    if (counted.relation) {
                                        setCount(count - 1);
                                        setCounted({ ...count, relation: false })
                                    }
                                }
                            }
                            }
                            placeholder="Relationship of dependent"
                            className={errState.relation ? ' showError' : 'text'}
                            style={{ width: '100%', height: 40 }} />
                        {errState.relation &&
                            <div style={{ color: "red", paddingBottom: 10 }}>{errState.relation}</div>
                        }
                    </div>
                    <div className='formComponent'>

                        <input type="text"
                            value={depIncome}
                            onInput={(e) => {
                                setdepIncome(e.target.value)
                            }}
                            onChange={(e) => {
                                const { value } = e.target
                                if (value) {
                                    const rx = /^[a-zA-Z0-9]*$/;
                                    if (rx.test(value)) {

                                        errdispatch({ type: 'remove_depinc_err' })
                                        if (!counted.depIncome) {
                                            setCount(count + 1);
                                            setCounted({ ...counted, depIncome: true })
                                        }
                                    }
                                    else {
                                        errdispatch({ type: 'add_depinc_err' })

                                        if (counted.depIncome) {
                                            setCount(count - 1);
                                            setCounted({ ...counted, depIncome: false })
                                        }
                                    }

                                } else {
                                    if (errState.depIncome)
                                        errdispatch({ type: 'remove_depinc_err' })
                                    if (counted.depIncome) {
                                        setCount(count - 1);
                                        setCounted({ ...counted, depIncome: false })
                                    }
                                }
                            }
                            }
                            placeholder="Dependent income source"
                            className={errState.depIncome ? ' showError' : 'text'}
                            style={{ width: '100%', height: 40 }} />
                        {errState.depIncome &&
                            <div style={{ color: "red", paddingBottom: 10 }}>{errState.depIncome}</div>
                        }
                    </div>

                    <div className='submit'>
                        <div className= 'btn' onClick={handleSubmit}><p style={{paddingTop: '4%'}} >Submit</p></div>
                    </div>
                </form>
            </div>

        </div>
    );
};


export default FormScreen;
