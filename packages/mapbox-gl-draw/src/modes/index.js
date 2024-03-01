
import simple_select from './simple_select';
import direct_select from './direct_select';
import draw_point from './draw_point';
import draw_polygon from './draw_polygon';
import draw_line_string from './draw_line_string';
import draw_circle from './DragCircleMode';
import direct_select_override from './DirectModeOverride';
import simple_select_override from './SimpleSelectModeOverride'
import static_select from './StaticMode'

export default {
  simple_select,//选择绘制目标
  direct_select,//选择控制点
  draw_point,
  draw_polygon,
  draw_line_string,
  draw_circle,
  direct_select_override,
  simple_select_override,
  static_select
};
