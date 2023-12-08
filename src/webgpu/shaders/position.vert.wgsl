@binding(0) @group(0) var<storage, read> testMatrix : array<mat4x4<f32>>;
struct VertexOutput {
    @builtin(position) Position : vec4<f32>,
    @location(0) fragPosition: vec4<f32>
};
@vertex
fn main(
    @builtin(vertex_index) vertexIndex : u32,
    @builtin(instance_index) instanceIndex : u32,
    @location(0) position : vec4<f32>,
    @location(1) rgba : vec4<f32>) -> VertexOutput {
    var output: VertexOutput;
    output.Position = testMatrix[instanceIndex * 4 + vertexIndex] * position;
    output.fragPosition = rgba;
    return output;
}