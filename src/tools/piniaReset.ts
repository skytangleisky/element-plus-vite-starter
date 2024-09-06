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
export default ({ options, store }: PiniaPluginContext): void => {//热更新后，因为pinia中store初始值未更新，所以恢复默认值只能恢复成第一次加载页面时的默认值而非是热更新后的默认值！！！
  store.$resetFields = (fields) => {
    const { state } = options
    const originalState = JSON.parse(JSON.stringify(state!()))
    store.$patch(($state) => {
      if(!fields){
        Object.assign($state, originalState)
      }else{
        // eval(`$state.${fields}=originalState.${fields}`)//编译会有警告
        new Function('source', 'target', `source.${fields}=target.${fields}`)($state, originalState)
      }
    })
  }
  store.$options = options
};
