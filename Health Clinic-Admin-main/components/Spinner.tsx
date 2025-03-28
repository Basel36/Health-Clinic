const Spinner =({invert=false}:{invert?:boolean})=>{
      return(
<div className={`h-8 w-8 animate-spin rounded-full border-4  border-t-transparent   saturate-200 ${invert?"invert":null}`} />
      )
}

export default Spinner;