//'use client';
import { useState, useEffect } from 'react';
import './NumberButtons.css';

export default function Numpad({handleNumberButtons, handleDelete, handleToggleCandidate}: 
                               {handleNumberButtons: (n: string) => void, 
                                 handleDelete: (n: string) => void, 
                                 handleToggleCandidate: () => void}) {


  const [cellCandidateMode, setCellCandidateMode] = useState(false);

  function NumberButtons(props: { handleClick: (n: string) => void }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) return <></>; // HackOverflow.com

    return(
      <div className='numpad'>
      <input type='button' value={1} className={'numberButton' + (cellCandidateMode ? ' candidateMode' : '')} onClick={() => props.handleClick('1')} />
      <input type='button' value={2} className={'numberButton' + (cellCandidateMode ? ' candidateMode' : '')} onClick={() => props.handleClick('2')} />
      <input type='button' value={3} className={'numberButton' + (cellCandidateMode ? ' candidateMode' : '')} onClick={() => props.handleClick('3')} />
      <input type='button' value={4} className={'numberButton' + (cellCandidateMode ? ' candidateMode' : '')} onClick={() => props.handleClick('4')} />
      <input type='button' value={5} className={'numberButton' + (cellCandidateMode ? ' candidateMode' : '')} onClick={() => props.handleClick('5')} />
      <input type='button' value={6} className={'numberButton' + (cellCandidateMode ? ' candidateMode' : '')} onClick={() => props.handleClick('6')} />
      <input type='button' value={7} className={'numberButton' + (cellCandidateMode ? ' candidateMode' : '')} onClick={() => props.handleClick('7')} />
      <input type='button' value={8} className={'numberButton' + (cellCandidateMode ? ' candidateMode' : '')} onClick={() => props.handleClick('8')} />
      <input type='button' value={9} className={'numberButton' + (cellCandidateMode ? ' candidateMode' : '')} onClick={() => props.handleClick('9')} />
      </div>
    )
  }

  function DeleteButton(props: {handleClick: (n: string) => void}) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) return <></>; // HackOverflow.com

    return(
      <input type='button' value={'Delete'} className='deleteButton' onClick={() => props.handleClick('') } />
    );
  }

  function ToggleCandidate(props: {handleClick: () => void}) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) return <></>; // HackOverflow.com

    return(
      <input type='button' value={(cellCandidateMode ? 'Set Final Digits' : 'Set Candidates')} className='deleteButton' 
      onClick={() => {
        props.handleClick();
        setCellCandidateMode(!cellCandidateMode);
      }} />
    )

  }

  return(
    <div>
    <NumberButtons handleClick={handleNumberButtons} />
    <DeleteButton handleClick={handleDelete} />
    <ToggleCandidate handleClick={handleToggleCandidate} />
    </div>
  )


}
