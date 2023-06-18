struct VertexOutput {
    @builtin(position) Position : vec4<f32>,
    @location(0) fragPosition: vec4<f32>
};
@vertex
fn main(@location(0) position : vec3<f32>, @location(1) rgba : vec4<f32>) -> VertexOutput {
    var output: VertexOutput;
    output.Position = vec4<f32>(position, 1.0);
    output.fragPosition = rgba;
    return output;
}