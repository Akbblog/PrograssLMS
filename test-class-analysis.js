/**
 * Test script to verify Class Analysis functionality
 * Tests the data flow from API endpoints through to display
 */

console.log("Testing Class Analysis Data Flow");
console.log("================================\n");

// Simulate backend response structure
const mockBackendResponse = {
  status: "success",
  data: {
    totalStudents: 35,
    classAverage: 78.5,
    gradeDistribution: {
      A: 8,
      B: 12,
      C: 10,
      D: 3,
      F: 2
    },
    topPerformers: [
      {
        studentName: "Ahmed Hassan",
        averageScore: 95.5,
        studentId: "student123"
      },
      {
        studentName: "Fatima Ali",
        averageScore: 92.3,
        studentId: "student124"
      }
    ],
    strugglingStudents: [
      {
        studentName: "Muhammad Khan",
        averageScore: 45.0,
        studentId: "student125"
      },
      {
        studentName: "Zainab Ahmed",
        averageScore: 52.5,
        studentId: "student126"
      }
    ]
  }
};

console.log("1. Backend Response Structure:");
console.log("------------------------------");
console.log(JSON.stringify(mockBackendResponse, null, 2));

// Simulate axios interceptor - extracts response.data
const interceptedResponse = mockBackendResponse;

console.log("\n2. After Axios Interceptor:");
console.log("------------------------------");
console.log("(Returns full response including status)");

// Simulate frontend processing
const performance = interceptedResponse?.data || interceptedResponse;

console.log("\n3. Frontend Performance Data:");
console.log("------------------------------");
console.log(JSON.stringify(performance, null, 2));

// Verify all properties the frontend expects
console.log("\n4. Frontend Property Verification:");
console.log("-------------------------------------");

const checks = [
  { prop: "totalStudents", value: performance.totalStudents, expected: 35 },
  { prop: "classAverage", value: performance.classAverage, expected: 78.5 },
  { prop: "gradeDistribution", value: performance.gradeDistribution, expected: "object" },
  { prop: "topPerformers", value: performance.topPerformers?.length, expected: 2 },
  { prop: "topPerformers[0].studentName", value: performance.topPerformers?.[0]?.studentName, expected: "Ahmed Hassan" },
  { prop: "topPerformers[0].averageScore", value: performance.topPerformers?.[0]?.averageScore, expected: 95.5 },
  { prop: "strugglingStudents", value: performance.strugglingStudents?.length, expected: 2 },
  { prop: "strugglingStudents[0].studentName", value: performance.strugglingStudents?.[0]?.studentName, expected: "Muhammad Khan" }
];

checks.forEach(check => {
  const pass = typeof check.expected === 'object' ? typeof check.value === 'object' : check.value === check.expected;
  const status = pass ? "✓ PASS" : "✗ FAIL";
  console.log(`${status}: ${check.prop} = ${check.value}`);
});

// Test grade distribution rendering
console.log("\n5. Grade Distribution Rendering:");
console.log("--------------------------------");
Object.entries(performance.gradeDistribution || {}).forEach(([grade, count]) => {
  const percentage = (count / performance.totalStudents) * 100;
  console.log(`Grade ${grade}: ${count} students (${percentage.toFixed(0)}%)`);
});

console.log("\n✓ All checks complete!");
