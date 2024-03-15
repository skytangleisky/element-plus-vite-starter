const map = new Map();
const observer = new ResizeObserver((entries)=>{
  for(const entry of entries){
    const handler = map.get(entry.target);
    handler && handler(entry)
  }
})
export default {
  mounted(el:HTMLElement,binding:any){
    map.set(el,binding.value)
    observer.observe(el)
  },
  unmounted(el:HTMLElement){
    map.delete(el)
    observer.unobserve(el)
  }
}