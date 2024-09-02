import { PiniaPluginContext } from "pinia";
declare module "pinia" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  export interface _StoreWithState<Id extends string, S extends StateTree, G, A>
    extends StoreProperties<Id> {
    //  选择自定义一个方法名，当然，你也可以覆盖$reset方法，这里只是不想破坏原有的东西，仅为示例
    $resetFields(fields?: String): void;
    $options:DefineStoreOptionsInPlugin<Id, S, G, A>;
  }
}
function setNestedValue(obj:any, newObj:any, path:string) {
  const keys = path.split('.'); // 将路径字符串分割为数组
  const lastKey = keys.pop()!; // 取出最后一个键

  // 逐级访问对象，直到倒数第二级
  const target = keys.reduce((acc, key) => acc[key], obj);

  // 将新值赋给目标属性
  target[lastKey] = keys.reduce((acc, key) => acc[key], newObj);
}
export default ({ options, store }: PiniaPluginContext): void => {//热更新后，因为pinia中store初始值未更新，所以恢复默认值只能恢复成第一次加载页面时的默认值而非是热更新后的默认值！！！
  store.$resetFields = (fields) => {
    const { state } = options
    const originalState = JSON.parse(JSON.stringify(state!()))
    store.$patch(($state) => {
      if(!fields){
        Object.assign($state, originalState)
      }else{
        // eval(`$state.${fields}=originalState.${fields}`)//编译会有警告
        const keys = fields.split('.')
        const lastKey = keys.pop()!;
        Object.assign($state[lastKey],keys.reduce((acc, key) => acc[key], originalState)[lastKey])
      }
    })
  }
  store.$options = options
};
