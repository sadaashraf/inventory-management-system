const Inputext=()=>{
    const handleOnChange=(event)=>{
        console.log(event.target.value);
    };
    return(
    <input type="text"
     placeholder="Enter Food items"
     className="Inputext"
     onChange={handleOnChange}
     />
   
    );
}
export default Inputext;