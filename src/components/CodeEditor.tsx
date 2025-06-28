import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

interface CodeEditorProps {
  onCodeChange: (code: string) => void;
  activeFile: string;
  onRunCode: (code: string, language: string) => void;
  isDarkMode?: boolean;
}

const CodeEditor = forwardRef<any, CodeEditorProps>(({ onCodeChange, activeFile, onRunCode, isDarkMode = false }, ref) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    getValue: () => {
      return editorRef.current?.getValue() || '';
    },
    setValue: (value: string) => {
      editorRef.current?.setValue(value);
    },
    getModel: () => {
      return editorRef.current?.getModel();
    },
    focus: () => {
      editorRef.current?.focus();
    }
  }));

  const getLanguageFromFile = (fileName: string): string => {
    if (fileName.endsWith('.tsx') || fileName.endsWith('.jsx')) return 'typescript';
    if (fileName.endsWith('.ts')) return 'typescript';
    if (fileName.endsWith('.js')) return 'javascript';
    if (fileName.endsWith('.css')) return 'css';
    if (fileName.endsWith('.html')) return 'html';
    if (fileName.endsWith('.json')) return 'json';
    if (fileName.endsWith('.md')) return 'markdown';
    if (fileName.endsWith('.py')) return 'python';
    if (fileName.endsWith('.java')) return 'java';
    if (fileName.endsWith('.cpp') || fileName.endsWith('.c')) return 'cpp';
    if (fileName.endsWith('.php')) return 'php';
    if (fileName.endsWith('.rb')) return 'ruby';
    if (fileName.endsWith('.go')) return 'go';
    if (fileName.endsWith('.rs')) return 'rust';
    if (fileName.endsWith('.sql')) return 'sql';
    if (fileName.endsWith('.xml')) return 'xml';
    if (fileName.endsWith('.yaml') || fileName.endsWith('.yml')) return 'yaml';
    return 'javascript';
  };

  const getSampleCode = (fileName: string): string => {
    switch (fileName) {
      case 'hello.js':
        return `// Welcome to Olive Code Editor!
// This is a comprehensive JavaScript example

console.log("🚀 Hello from Olive!");

// Variables and Data Types
const name = "Olive Developer";
let age = 25;
var isActive = true;

// Arrays and Objects
const fruits = ["apple", "banana", "orange"];
const person = {
  name: "Alice",
  age: 30,
  skills: ["JavaScript", "Python", "React"]
};

// Functions
function greetUser(userName) {
  return \`Hello, \${userName}! Welcome to coding.\`;
}

// Arrow Functions
const calculateArea = (width, height) => width * height;

// Array Methods
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);
const evens = numbers.filter(num => num % 2 === 0);

console.log("Greeting:", greetUser(name));
console.log("Area:", calculateArea(10, 5));
console.log("Doubled numbers:", doubled);
console.log("Even numbers:", evens);

// Async/Await Example
async function fetchData() {
  try {
    console.log("Fetching data...");
    // Simulated API call
    const data = await new Promise(resolve => 
      setTimeout(() => resolve("Data loaded!"), 1000)
    );
    console.log("Result:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

fetchData();

// Classes
class Calculator {
  constructor() {
    this.result = 0;
  }
  
  add(num) {
    this.result += num;
    return this;
  }
  
  multiply(num) {
    this.result *= num;
    return this;
  }
  
  getResult() {
    return this.result;
  }
}

const calc = new Calculator();
const result = calc.add(5).multiply(3).getResult();
console.log("Calculator result:", result);`;

      case 'example.py':
        return `# Welcome to Python in Olive!
# This demonstrates Python fundamentals

print("🐍 Hello from Python!")

# Variables and Data Types
name = "Python Developer"
age = 28
is_programmer = True

# Lists and Dictionaries
fruits = ["apple", "banana", "cherry"]
person = {
    "name": "Bob",
    "age": 35,
    "skills": ["Python", "Django", "FastAPI"]
}

# Functions
def greet_user(user_name):
    return f"Hello, {user_name}! Ready to code?"

def calculate_area(width, height):
    return width * height

# List Comprehensions
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
squares = [x**2 for x in numbers]
evens = [x for x in numbers if x % 2 == 0]

print(f"Greeting: {greet_user(name)}")
print(f"Area: {calculate_area(12, 8)}")
print(f"Squares: {squares}")
print(f"Even numbers: {evens}")

# Classes
class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance
    
    def deposit(self, amount):
        self.balance += amount
        return f"Deposited ${amount}. New balance: ${self.balance}"
    
    def withdraw(self, amount):
        if amount <= self.balance:
            self.balance -= amount
            return f"Withdrew ${amount}. New balance: ${self.balance}"
        return "Insufficient funds!"

# Using the class
account = BankAccount("Alice", 100)
print(account.deposit(50))
print(account.withdraw(30))

# Loops and Control Flow
print("\\nCounting to 5:")
for i in range(1, 6):
    print(f"Count: {i}")

# Dictionary iteration
print("\\nPerson details:")
for key, value in person.items():
    print(f"{key}: {value}")

# Exception Handling
try:
    result = 10 / 2
    print(f"Division result: {result}")
except ZeroDivisionError:
    print("Cannot divide by zero!")
finally:
    print("Math operation completed.")

print("\\n✅ Python script execution completed!")`;

      case 'sample.html':
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🌐 Olive Web Demo</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .container {
            background: white;
            padding: 2rem;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 500px;
            width: 90%;
        }
        
        h1 {
            color: #333;
            margin-bottom: 1rem;
            font-size: 2.5rem;
        }
        
        .emoji {
            font-size: 3rem;
            margin: 1rem 0;
            animation: bounce 2s infinite;
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-10px);
            }
            60% {
                transform: translateY(-5px);
            }
        }
        
        .button {
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1rem;
            margin: 10px;
            transition: transform 0.3s ease;
        }
        
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        .counter {
            font-size: 1.5rem;
            margin: 1rem 0;
            color: #555;
        }
        
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 1rem;
            margin: 2rem 0;
        }
        
        .feature {
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 10px;
            transition: transform 0.3s ease;
        }
        
        .feature:hover {
            transform: scale(1.05);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to Olive!</h1>
        <div class="emoji">🚀</div>
        <p>Interactive web development made simple</p>
        
        <div class="counter">
            <p>Button clicks: <span id="clickCount">0</span></p>
        </div>
        
        <button class="button" onclick="incrementCounter()">
            Click Me! 🎉
        </button>
        
        <button class="button" onclick="changeEmoji()">
            Change Emoji 🔄
        </button>
        
        <button class="button" onclick="toggleTheme()">
            Toggle Theme 🌙
        </button>
        
        <div class="feature-grid">
            <div class="feature">
                <h3>🎨</h3>
                <p>Beautiful Design</p>
            </div>
            <div class="feature">
                <h3>⚡</h3>
                <p>Fast Performance</p>
            </div>
            <div class="feature">
                <h3>📱</h3>
                <p>Responsive</p>
            </div>
            <div class="feature">
                <h3>🔧</h3>
                <p>Easy to Use</p>
            </div>
        </div>
    </div>

    <script>
        let clickCount = 0;
        let isDarkTheme = false;
        const emojis = ['🚀', '🎉', '⭐', '🌟', '💫', '🎊', '🎈', '🎯'];
        let currentEmojiIndex = 0;
        
        function incrementCounter() {
            clickCount++;
            document.getElementById('clickCount').textContent = clickCount;
            
            // Add some celebration effects
            if (clickCount % 5 === 0) {
                document.body.style.animation = 'none';
                setTimeout(() => {
                    document.body.style.animation = '';
                }, 10);
                alert(\`🎉 Congratulations! You've clicked \${clickCount} times!\`);
            }
        }
        
        function changeEmoji() {
            currentEmojiIndex = (currentEmojiIndex + 1) % emojis.length;
            document.querySelector('.emoji').textContent = emojis[currentEmojiIndex];
        }
        
        function toggleTheme() {
            isDarkTheme = !isDarkTheme;
            const body = document.body;
            const container = document.querySelector('.container');
            
            if (isDarkTheme) {
                body.style.background = 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)';
                container.style.background = '#34495e';
                container.style.color = 'white';
            } else {
                body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                container.style.background = 'white';
                container.style.color = 'black';
            }
        }
        
        // Add some interactive features
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🌐 Olive HTML Demo loaded successfully!');
            
            // Add keyboard shortcuts
            document.addEventListener('keydown', function(e) {
                if (e.key === ' ') {
                    e.preventDefault();
                    incrementCounter();
                } else if (e.key === 'e') {
                    changeEmoji();
                } else if (e.key === 't') {
                    toggleTheme();
                }
            });
            
            // Add mouse trail effect
            document.addEventListener('mousemove', function(e) {
                const trail = document.createElement('div');
                trail.style.position = 'fixed';
                trail.style.left = e.clientX + 'px';
                trail.style.top = e.clientY + 'px';
                trail.style.width = '5px';
                trail.style.height = '5px';
                trail.style.background = 'rgba(255,255,255,0.5)';
                trail.style.borderRadius = '50%';
                trail.style.pointerEvents = 'none';
                trail.style.zIndex = '9999';
                document.body.appendChild(trail);
                
                setTimeout(() => {
                    trail.remove();
                }, 500);
            });
        });
    </script>
</body>
</html>`;

      case 'advanced.js':
        return `// Advanced JavaScript Concepts in Olive
// Modern ES6+ features and patterns

console.log("🚀 Advanced JavaScript Demo");

// 1. Destructuring Assignment
const user = {
  name: "John Doe",
  age: 30,
  address: {
    city: "New York",
    country: "USA"
  },
  hobbies: ["reading", "coding", "gaming"]
};

const { name, age, address: { city } } = user;
const [firstHobby, ...otherHobbies] = user.hobbies;

console.log(\`User: \${name}, Age: \${age}, City: \${city}\`);
console.log(\`First hobby: \${firstHobby}, Others: \${otherHobbies.join(", ")}\`);

// 2. Template Literals and Tagged Templates
function highlight(strings, ...values) {
  return strings.reduce((result, string, i) => {
    const value = values[i] ? \`**\${values[i]}**\` : '';
    return result + string + value;
  }, '');
}

const message = highlight\`Hello \${name}, you are \${age} years old!\`;
console.log("Tagged template:", message);

// 3. Async/Await with Error Handling
class APIClient {
  static async fetchUser(id) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (id < 1) throw new Error("Invalid user ID");
      
      return {
        id,
        name: \`User \${id}\`,
        email: \`user\${id}@example.com\`
      };
    } catch (error) {
      console.error("API Error:", error.message);
      throw error;
    }
  }
}

// 4. Generators and Iterators
function* fibonacci(max = 10) {
  let [a, b] = [0, 1];
  let count = 0;
  
  while (count < max) {
    yield a;
    [a, b] = [b, a + b];
    count++;
  }
}

console.log("Fibonacci sequence:");
for (const num of fibonacci(8)) {
  console.log(num);
}

// 5. Promises and Promise.all
const promises = [
  APIClient.fetchUser(1),
  APIClient.fetchUser(2),
  APIClient.fetchUser(3)
];

Promise.all(promises)
  .then(users => {
    console.log("All users fetched:", users);
  })
  .catch(error => {
    console.error("Failed to fetch users:", error);
  });

// 6. Closures and Higher-Order Functions
function createCounter(initialValue = 0) {
  let count = initialValue;
  
  return {
    increment: (step = 1) => count += step,
    decrement: (step = 1) => count -= step,
    getValue: () => count,
    reset: () => count = initialValue
  };
}

const counter = createCounter(5);
console.log("Counter initial:", counter.getValue());
console.log("After increment:", counter.increment(3));
console.log("After decrement:", counter.decrement(1));

// 7. Proxy and Reflection
const observableObject = new Proxy({}, {
  set(target, property, value) {
    console.log(\`Setting \${property} = \${value}\`);
    target[property] = value;
    return true;
  },
  get(target, property) {
    console.log(\`Getting \${property}\`);
    return target[property];
  }
});

observableObject.name = "Observable";
console.log("Value:", observableObject.name);

// 8. Modules and Namespacing
const MathUtils = {
  PI: Math.PI,
  
  circle: {
    area: radius => MathUtils.PI * radius ** 2,
    circumference: radius => 2 * MathUtils.PI * radius
  },
  
  random: {
    between: (min, max) => Math.random() * (max - min) + min,
    integer: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
  }
};

console.log("Circle area (r=5):", MathUtils.circle.area(5));
console.log("Random number:", MathUtils.random.between(1, 100));

// 9. WeakMap and WeakSet for Memory Management
const privateData = new WeakMap();

class SecureUser {
  constructor(name, secret) {
    this.name = name;
    privateData.set(this, { secret });
  }
  
  getSecret() {
    return privateData.get(this).secret;
  }
  
  updateSecret(newSecret) {
    const data = privateData.get(this);
    data.secret = newSecret;
  }
}

const secureUser = new SecureUser("Alice", "top-secret");
console.log("User secret:", secureUser.getSecret());

// 10. Symbol for unique identifiers
const PRIVATE_METHOD = Symbol('privateMethod');
const PUBLIC_API = Symbol('publicAPI');

class AdvancedClass {
  constructor() {
    this[PRIVATE_METHOD] = () => "This is private";
  }
  
  [PUBLIC_API]() {
    return "This is public API";
  }
  
  callPrivate() {
    return this[PRIVATE_METHOD]();
  }
}

const instance = new AdvancedClass();
console.log("Private method result:", instance.callPrivate());
console.log("Public API result:", instance[PUBLIC_API]());

console.log("\\n✅ Advanced JavaScript concepts demonstrated!");`;

      case 'data-structures.py':
        return `# Data Structures and Algorithms in Python
# Comprehensive examples for learning

print("📊 Data Structures & Algorithms Demo")

# 1. Stack Implementation
class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        self.items.append(item)
    
    def pop(self):
        if not self.is_empty():
            return self.items.pop()
        return None
    
    def peek(self):
        if not self.is_empty():
            return self.items[-1]
        return None
    
    def is_empty(self):
        return len(self.items) == 0
    
    def size(self):
        return len(self.items)

# Using Stack
stack = Stack()
for i in range(1, 6):
    stack.push(i)
    print(f"Pushed {i}, stack size: {stack.size()}")

print(f"Top element: {stack.peek()}")
print(f"Popped: {stack.pop()}")

# 2. Queue Implementation
from collections import deque

class Queue:
    def __init__(self):
        self.items = deque()
    
    def enqueue(self, item):
        self.items.append(item)
    
    def dequeue(self):
        if not self.is_empty():
            return self.items.popleft()
        return None
    
    def front(self):
        if not self.is_empty():
            return self.items[0]
        return None
    
    def is_empty(self):
        return len(self.items) == 0
    
    
    
    def size(self):
        return len(self.items)

# Using Queue
queue = Queue()
for item in ['A', 'B', 'C', 'D']:
    queue.enqueue(item)
    print(f"Enqueued {item}")

print(f"Front: {queue.front()}")
print(f"Dequeued: {queue.dequeue()}")

# 3. Binary Tree
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class BinaryTree:
    def __init__(self):
        self.root = None
    
    def insert(self, val):
        if not self.root:
            self.root = TreeNode(val)
        else:
            self._insert_recursive(self.root, val)
    
    def _insert_recursive(self, node, val):
        if val < node.val:
            if node.left is None:
                node.left = TreeNode(val)
            else:
                self._insert_recursive(node.left, val)
        else:
            if node.right is None:
                node.right = TreeNode(val)
            else:
                self._insert_recursive(node.right, val)
    
    def inorder_traversal(self, node=None, result=None):
        if result is None:
            result = []
        if node is None:
            node = self.root
        
        if node:
            self.inorder_traversal(node.left, result)
            result.append(node.val)
            self.inorder_traversal(node.right, result)
        
        return result

# Using Binary Tree
tree = BinaryTree()
values = [50, 30, 70, 20, 40, 60, 80]
for val in values:
    tree.insert(val)

print(f"Inorder traversal: {tree.inorder_traversal()}")

# 4. Graph Implementation
class Graph:
    def __init__(self):
        self.graph = {}
    
    def add_vertex(self, vertex):
        if vertex not in self.graph:
            self.graph[vertex] = []
    
    def add_edge(self, vertex1, vertex2):
        self.add_vertex(vertex1)
        self.add_vertex(vertex2)
        self.graph[vertex1].append(vertex2)
        self.graph[vertex2].append(vertex1)  # Undirected graph
    
    def bfs(self, start):
        visited = set()
        queue = [start]
        result = []
        
        while queue:
            vertex = queue.pop(0)
            if vertex not in visited:
                visited.add(vertex)
                result.append(vertex)
                queue.extend([v for v in self.graph[vertex] if v not in visited])
        
        return result
    
    def dfs(self, start, visited=None, result=None):
        if visited is None:
            visited = set()
        if result is None:
            result = []
        
        visited.add(start)
        result.append(start)
        
        for neighbor in self.graph[start]:
            if neighbor not in visited:
                self.dfs(neighbor, visited, result)
        
        return result

# Using Graph
graph = Graph()
edges = [('A', 'B'), ('A', 'C'), ('B', 'D'), ('C', 'E'), ('D', 'F')]
for v1, v2 in edges:
    graph.add_edge(v1, v2)

print(f"BFS from A: {graph.bfs('A')}")
print(f"DFS from A: {graph.dfs('A')}")

# 5. Sorting Algorithms
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quick_sort(left) + middle + quick_sort(right)

def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result

# Testing sorting algorithms
test_array = [64, 34, 25, 12, 22, 11, 90]
print(f"Original array: {test_array}")
print(f"Bubble sort: {bubble_sort(test_array.copy())}")
print(f"Quick sort: {quick_sort(test_array.copy())}")
print(f"Merge sort: {merge_sort(test_array.copy())}")

# 6. Hash Table Implementation
class HashTable:
    def __init__(self, size=10):
        self.size = size
        self.table = [[] for _ in range(size)]
    
    def _hash(self, key):
        return hash(key) % self.size
    
    def set(self, key, value):
        index = self._hash(key)
        bucket = self.table[index]
        
        for i, (k, v) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)
                return
        
        bucket.append((key, value))
    
    def get(self, key):
        index = self._hash(key)
        bucket = self.table[index]
        
        for k, v in bucket:
            if k == key:
                return v
        
        raise KeyError(key)
    
    def delete(self, key):
        index = self._hash(key)
        bucket = self.table[index]
        
        for i, (k, v) in enumerate(bucket):
            if k == key:
                del bucket[i]
                return
        
        raise KeyError(key)

# Using Hash Table
hash_table = HashTable()
hash_table.set("name", "Alice")
hash_table.set("age", 30)
hash_table.set("city", "New York")

print(f"Name: {hash_table.get('name')}")
print(f"Age: {hash_table.get('age')}")

# 7. Dynamic Programming Example - Fibonacci
def fibonacci_dp(n, memo={}):
    if n in memo:
        return memo[n]
    
    if n <= 1:
        return n
    
    memo[n] = fibonacci_dp(n-1, memo) + fibonacci_dp(n-2, memo)
    return memo[n]

print(f"Fibonacci(20) with DP: {fibonacci_dp(20)}")

# 8. Binary Search
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1

sorted_array = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
target = 7
result = binary_search(sorted_array, target)
print(f"Binary search for {target}: index {result}")

print("\\n✅ Data structures and algorithms demonstration completed!")`;

      case 'web-components.html':
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🌐 Modern Web Components</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 2rem;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            backdrop-filter: blur(10px);
        }
        
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 2rem;
            font-size: 2.5rem;
            background: linear-gradient(45deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .components-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-bottom: 2rem;
        }
        
        .component-card {
            background: white;
            border-radius: 15px;
            padding: 1.5rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .component-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        
        .component-title {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: #333;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        /* Custom Button Component */
        .custom-button {
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .custom-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        
        .custom-button:active {
            transform: translateY(0);
        }
        
        .custom-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
        }
        
        .custom-button:hover::before {
            left: 100%;
        }
        
        /* Progress Bar Component */
        .progress-container {
            width: 100%;
            height: 20px;
            background: #e0e0e0;
            border-radius: 10px;
            overflow: hidden;
            margin: 1rem 0;
        }
        
        .progress-bar {
            height: 100%;
            background: linear-gradient(45deg, #667eea, #764ba2);
            border-radius: 10px;
            transition: width 0.3s ease;
            position: relative;
        }
        
        .progress-bar::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%);
            animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        
        /* Card Flip Component */
        .flip-card {
            background-color: transparent;
            width: 100%;
            height: 200px;
            perspective: 1000px;
            margin: 1rem 0;
        }
        
        .flip-card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            text-align: center;
            transition: transform 0.6s;
            transform-style: preserve-3d;
            cursor: pointer;
        }
        
        .flip-card:hover .flip-card-inner {
            transform: rotateY(180deg);
        }
        
        .flip-card-front, .flip-card-back {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            font-weight: bold;
        }
        
        .flip-card-front {
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
        }
        
        .flip-card-back {
            background: linear-gradient(45deg, #764ba2, #667eea);
            color: white;
            transform: rotateY(180deg);
        }
        
        /* Modal Component */
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            backdrop-filter: blur(5px);
        }
        
        .modal-content {
            background-color: white;
            margin: 15% auto;
            padding: 2rem;
            border-radius: 20px;
            width: 80%;
            max-width: 500px;
            position: relative;
            animation: modalSlideIn 0.3s ease;
        }
        
        @keyframes modalSlideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        .close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            position: absolute;
            right: 1rem;
            top: 1rem;
        }
        
        .close:hover {
            color: #000;
        }
        
        /* Accordion Component */
        .accordion {
            border: 1px solid #ddd;
            border-radius: 10px;
            overflow: hidden;
            margin: 1rem 0;
        }
        
        .accordion-item {
            border-bottom: 1px solid #ddd;
        }
        
        .accordion-item:last-child {
            border-bottom: none;
        }
        
        .accordion-header {
            background: #f8f9fa;
            padding: 1rem;
            cursor: pointer;
            transition: background 0.3s ease;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .accordion-header:hover {
            background: #e9ecef;
        }
        
        .accordion-content {
            padding: 0 1rem;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease, padding 0.3s ease;
        }
        
        .accordion-content.active {
            max-height: 200px;
            padding: 1rem;
        }
        
        /* Tooltip Component */
        .tooltip {
            position: relative;
            display: inline-block;
            cursor: pointer;
        }
        
        .tooltip .tooltiptext {
            visibility: hidden;
            width: 200px;
            background-color: #333;
            color: #fff;
            text-align: center;
            border-radius: 6px;
            padding: 8px;
            position: absolute;
            z-index: 1;
            bottom: 125%;
            left: 50%;
            margin-left: -100px;
            opacity: 0;
            transition: opacity 0.3s;
            font-size: 0.9rem;
        }
        
        .tooltip .tooltiptext::after {
            content: "";
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: #333 transparent transparent transparent;
        }
        
        .tooltip:hover .tooltiptext {
            visibility: visible;
            opacity: 1;
        }
        
        /* Loading Spinner */
        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 1rem auto;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* Notification Toast */
        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            transform: translateX(400px);
            transition: transform 0.3s ease;
            z-index: 1000;
        }
        
        .toast.show {
            transform: translateX(0);
        }
        
        .toast.success {
            background: #28a745;
        }
        
        .toast.error {
            background: #dc3545;
        }
        
        .toast.warning {
            background: #ffc107;
            color: #333;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌐 Modern Web Components</h1>
        
        <div class="components-grid">
            <!-- Custom Button Component -->
            <div class="component-card">
                <div class="component-title">
                    🔘 Custom Buttons
                </div>
                <button class="custom-button" onclick="showToast('Button clicked!', 'success')">
                    Animated Button
                </button>
                <button class="custom-button" onclick="openModal()" style="margin-left: 10px;">
                    Open Modal
                </button>
            </div>
            
            <!-- Progress Bar Component -->
            <div class="component-card">
                <div class="component-title">
                    📊 Progress Bar
                </div>
                <div class="progress-container">
                    <div class="progress-bar" id="progressBar" style="width: 0%"></div>
                </div>
                <button class="custom-button" onclick="animateProgress()">
                    Start Progress
                </button>
            </div>
            
            <!-- Card Flip Component -->
            <div class="component-card">
                <div class="component-title">
                    🔄 Flip Card
                </div>
                <div class="flip-card">
                    <div class="flip-card-inner">
                        <div class="flip-card-front">
                            <p>Hover to flip! 🎯</p>
                        </div>
                        <div class="flip-card-back">
                            <p>Amazing flip effect! ✨</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Accordion Component -->
            <div class="component-card">
                <div class="component-title">
                    📋 Accordion
                </div>
                <div class="accordion">
                    <div class="accordion-item">
                        <div class="accordion-header" onclick="toggleAccordion(this)">
                            <span>Section 1</span>
                            <span>+</span>
                        </div>
                        <div class="accordion-content">
                            <p>This is the content for section 1. It contains detailed information about the topic.</p>
                        </div>
                    </div>
                    <div class="accordion-item">
                        <div class="accordion-header" onclick="toggleAccordion(this)">
                            <span>Section 2</span>
                            <span>+</span>
                        </div>
                        <div class="accordion-content">
                            <p>This is the content for section 2. More interesting details can be found here.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Tooltip Component -->
            <div class="component-card">
                <div class="component-title">
                    💬 Tooltips
                </div>
                <div class="tooltip">
                    <button class="custom-button">Hover for tooltip</button>
                    <span class="tooltiptext">This is a beautiful tooltip with smooth animations!</span>
                </div>
            </div>
            
            <!-- Loading Spinner -->
            <div class="component-card">
                <div class="component-title">
                    ⏳ Loading Spinner
                </div>
                <div class="spinner" id="spinner" style="display: none;"></div>
                <button class="custom-button" onclick="showSpinner()">
                    Show Loading
                </button>
            </div>
        </div>
    </div>
    
    <!-- Modal Component -->
    <div id="myModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2>🎉 Modal Component</h2>
            <p>This is a beautiful modal with backdrop blur and smooth animations!</p>
            <button class="custom-button" onclick="closeModal()">Close Modal</button>
        </div>
    </div>
    
    <!-- Toast Notification -->
    <div id="toast" class="toast"></div>

    <script>
        // Progress Bar Animation
        function animateProgress() {
            const progressBar = document.getElementById('progressBar');
            let width = 0;
            const interval = setInterval(() => {
                if (width >= 100) {
                    clearInterval(interval);
                    showToast('Progress completed!', 'success');
                } else {
                    width += 2;
                    progressBar.style.width = width + '%';
                }
            }, 50);
        }
        
        // Modal Functions
        function openModal() {
            document.getElementById('myModal').style.display = 'block';
        }
        
        function closeModal() {
            document.getElementById('myModal').style.display = 'none';
        }
        
        // Close modal when clicking outside
        window.onclick = function(event) {
            const modal = document.getElementById('myModal');
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        }
        
        // Accordion Functions
        function toggleAccordion(header) {
            const content = header.nextElementSibling;
            const icon = header.querySelector('span:last-child');
            
            // Close all other accordion items
            document.querySelectorAll('.accordion-content').forEach(item => {
                if (item !== content) {
                    item.classList.remove('active');
                    item.previousElementSibling.querySelector('span:last-child').textContent = '+';
                }
            });
            
            // Toggle current item
            content.classList.toggle('active');
            icon.textContent = content.classList.contains('active') ? '-' : '+';
        }
        
        // Toast Notification
        function showToast(message, type = 'success') {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.className = \`toast \${type} show\`;
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
        
        // Loading Spinner
        function showSpinner() {
            const spinner = document.getElementById('spinner');
            spinner.style.display = 'block';
            
            setTimeout(() => {
                spinner.style.display = 'none';
                showToast('Loading completed!', 'success');
            }, 3000);
        }
        
        // Add some interactive features
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🌐 Modern Web Components loaded successfully!');
            
            // Add keyboard shortcuts
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closeModal();
                } else if (e.key === 'm') {
                    openModal();
                } else if (e.key === 'p') {
                    animateProgress();
                }
            });
            
            // Add smooth scrolling
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    document.querySelector(this.getAttribute('href')).scrollIntoView({
                        behavior: 'smooth'
                    });
                });
            });
            
            // Welcome message
            setTimeout(() => {
                showToast('Welcome to Modern Web Components! 🎉', 'success');
            }, 1000);
        });
    </script>
</body>
</html>`;

      case 'algorithms.cpp':
        return `// Advanced Algorithms in C++
// Comprehensive examples for competitive programming

#include <iostream>
#include <vector>
#include <algorithm>
#include <queue>
#include <stack>
#include <map>
#include <set>
#include <string>
#include <climits>

using namespace std;

// 1. Binary Search Implementation
int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}

// 2. Quick Sort Implementation
void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

// 3. Merge Sort Implementation
void mergeSort(vector<int>& arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

void merge(vector<int>& arr, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    
    vector<int> leftArr(n1), rightArr(n2);
    
    for (int i = 0; i < n1; i++)
        leftArr[i] = arr[left + i];
    for (int j = 0; j < n2; j++)
        rightArr[j] = arr[mid + 1 + j];
    
    int i = 0, j = 0, k = left;
    
    while (i < n1 && j < n2) {
        if (leftArr[i] <= rightArr[j]) {
            arr[k] = leftArr[i];
            i++;
        } else {
            arr[k] = rightArr[j];
            j++;
        }
        k++;
    }
    
    while (i < n1) {
        arr[k] = leftArr[i];
        i++;
        k++;
    }
    
    while (j < n2) {
        arr[k] = rightArr[j];
        j++;
        k++;
    }
}

// 4. Graph Algorithms - DFS and BFS
class Graph {
private:
    int vertices;
    vector<vector<int>> adjList;

public:
    Graph(int v) : vertices(v) {
        adjList.resize(v);
    }
    
    void addEdge(int u, int v) {
        adjList[u].push_back(v);
        adjList[v].push_back(u); // For undirected graph
    }
    
    void DFS(int start) {
        vector<bool> visited(vertices, false);
        stack<int> stack;
        
        stack.push(start);
        cout << "DFS traversal: ";
        
        while (!stack.empty()) {
            int vertex = stack.top();
            stack.pop();
            
            if (!visited[vertex]) {
                visited[vertex] = true;
                cout << vertex << " ";
                
                for (int neighbor : adjList[vertex]) {
                    if (!visited[neighbor]) {
                        stack.push(neighbor);
                    }
                }
            }
        }
        cout << endl;
    }
    
    void BFS(int start) {
        vector<bool> visited(vertices, false);
        queue<int> queue;
        
        queue.push(start);
        visited[start] = true;
        cout << "BFS traversal: ";
        
        while (!queue.empty()) {
            int vertex = queue.front();
            queue.pop();
            cout << vertex << " ";
            
            for (int neighbor : adjList[vertex]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.push(neighbor);
                }
            }
        }
        cout << endl;
    }
};

// 5. Dynamic Programming - Longest Common Subsequence
int longestCommonSubsequence(string text1, string text2) {
    int m = text1.length();
    int n = text2.length();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1[i - 1] == text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    return dp[m][n];
}

// 6. Dijkstra's Algorithm for Shortest Path
vector<int> dijkstra(vector<vector<pair<int, int>>>& graph, int start) {
    int n = graph.size();
    vector<int> dist(n, INT_MAX);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    
    dist[start] = 0;
    pq.push({0, start});
    
    while (!pq.empty()) {
        int u = pq.top().second;
        pq.pop();
        
        for (auto& edge : graph[u]) {
            int v = edge.first;
            int weight = edge.second;
            
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
    
    return dist;
}

// 7. Knapsack Problem (0/1)
int knapsack(vector<int>& weights, vector<int>& values, int capacity) {
    int n = weights.size();
    vector<vector<int>> dp(n + 1, vector<int>(capacity + 1, 0));
    
    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= capacity; w++) {
            if (weights[i - 1] <= w) {
                dp[i][w] = max(
                    values[i - 1] + dp[i - 1][w - weights[i - 1]],
                    dp[i - 1][w]
                );
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    
    return dp[n][capacity];
}

// 8. Binary Tree Operations
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class BinaryTree {
public:
    TreeNode* insert(TreeNode* root, int val) {
        if (!root) {
            return new TreeNode(val);
        }
        
        if (val < root->val) {
            root->left = insert(root->left, val);
        } else {
            root->right = insert(root->right, val);
        }
        
        return root;
    }
    
    void inorderTraversal(TreeNode* root) {
        if (root) {
            inorderTraversal(root->left);
            cout << root->val << " ";
            inorderTraversal(root->right);
        }
    }
    
    int maxDepth(TreeNode* root) {
        if (!root) return 0;
        return 1 + max(maxDepth(root->left), maxDepth(root->right));
    }
};

// 9. String Algorithms - KMP Pattern Matching
vector<int> computeLPS(string pattern) {
    int m = pattern.length();
    vector<int> lps(m, 0);
    int len = 0;
    int i = 1;
    
    while (i < m) {
        if (pattern[i] == pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len != 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    
    return lps;
}

vector<int> KMPSearch(string text, string pattern) {
    vector<int> result;
    vector<int> lps = computeLPS(pattern);
    int n = text.length();
    int m = pattern.length();
    int i = 0, j = 0;
    
    while (i < n) {
        if (pattern[j] == text[i]) {
            i++;
            j++;
        }
        
        if (j == m) {
            result.push_back(i - j);
            j = lps[j - 1];
        } else if (i < n && pattern[j] != text[i]) {
            if (j != 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }
    
    return result;
}

// Main function to demonstrate algorithms
int main() {
    cout << "🔧 Advanced Algorithms in C++ Demo" << endl;
    cout << "====================================" << endl;
    
    // 1. Binary Search Demo
    vector<int> sortedArray = {1, 3, 5, 7, 9, 11, 13, 15, 17, 19};
    int target = 7;
    int index = binarySearch(sortedArray, target);
    cout << "Binary Search: Found " << target << " at index " << index << endl;
    
    // 2. Sorting Demo
    vector<int> unsortedArray = {64, 34, 25, 12, 22, 11, 90};
    cout << "Original array: ";
    for (int num : unsortedArray) cout << num << " ";
    cout << endl;
    
    vector<int> quickSortArray = unsortedArray;
    quickSort(quickSortArray, 0, quickSortArray.size() - 1);
    cout << "Quick Sort result: ";
    for (int num : quickSortArray) cout << num << " ";
    cout << endl;
    
    // 3. Graph Algorithms Demo
    Graph graph(6);
    graph.addEdge(0, 1);
    graph.addEdge(0, 2);
    graph.addEdge(1, 3);
    graph.addEdge(2, 4);
    graph.addEdge(3, 5);
    
    graph.DFS(0);
    graph.BFS(0);
    
    // 4. Dynamic Programming Demo
    string text1 = "abcde";
    string text2 = "ace";
    int lcsLength = longestCommonSubsequence(text1, text2);
    cout << "LCS of '" << text1 << "' and '" << text2 << "': " << lcsLength << endl;
    
    // 5. Knapsack Problem Demo
    vector<int> weights = {10, 20, 30};
    vector<int> values = {60, 100, 120};
    int capacity = 50;
    int maxValue = knapsack(weights, values, capacity);
    cout << "Knapsack max value: " << maxValue << endl;
    
    // 6. Binary Tree Demo
    BinaryTree tree;
    TreeNode* root = nullptr;
    vector<int> treeValues = {50, 30, 70, 20, 40, 60, 80};
    
    for (int val : treeValues) {
        root = tree.insert(root, val);
    }
    
    cout << "Binary Tree inorder traversal: ";
    tree.inorderTraversal(root);
    cout << endl;
    cout << "Tree max depth: " << tree.maxDepth(root) << endl;
    
    // 7. String Pattern Matching Demo
    string text = "ABABDABACDABABCABCABCABCABC";
    string pattern = "ABABCABCABCABC";
    vector<int> matches = KMPSearch(text, pattern);
    
    cout << "Pattern matches found at positions: ";
    for (int pos : matches) {
        cout << pos << " ";
    }
    cout << endl;
    
    cout << "\\n✅ All algorithms demonstrated successfully!" << endl;
    
    return 0;
}`;

      case 'machine-learning.py':
        return `# Machine Learning Concepts in Python
# Comprehensive examples for data science and ML

import math
import random
from typing import List, Tuple, Dict, Any

print("🤖 Machine Learning Concepts Demo")
print("==================================")

# 1. Linear Regression Implementation
class LinearRegression:
    def __init__(self, learning_rate=0.01, max_iterations=1000):
        self.learning_rate = learning_rate
        self.max_iterations = max_iterations
        self.weights = None
        self.bias = None
        self.cost_history = []
    
    def fit(self, X: List[List[float]], y: List[float]):
        # Initialize parameters
        n_samples, n_features = len(X), len(X[0])
        self.weights = [0.0] * n_features
        self.bias = 0.0
        
        # Gradient descent
        for i in range(self.max_iterations):
            # Forward pass
            y_pred = self.predict(X)
            
            # Compute cost
            cost = self._compute_cost(y, y_pred)
            self.cost_history.append(cost)
            
            # Compute gradients
            dw = [0.0] * n_features
            db = 0.0
            
            for j in range(n_samples):
                error = y_pred[j] - y[j]
                for k in range(n_features):
                    dw[k] += error * X[j][k]
                db += error
            
            # Update parameters
            for k in range(n_features):
                self.weights[k] -= self.learning_rate * dw[k] / n_samples
            self.bias -= self.learning_rate * db / n_samples
    
    def predict(self, X: List[List[float]]) -> List[float]:
        predictions = []
        for sample in X:
            pred = self.bias
            for i, feature in enumerate(sample):
                pred += self.weights[i] * feature
            predictions.append(pred)
        return predictions
    
    def _compute_cost(self, y_true: List[float], y_pred: List[float]) -> float:
        n = len(y_true)
        cost = sum((y_pred[i] - y_true[i]) ** 2 for i in range(n))
        return cost / (2 * n)

# 2. Logistic Regression Implementation
class LogisticRegression:
    def __init__(self, learning_rate=0.01, max_iterations=1000):
        self.learning_rate = learning_rate
        self.max_iterations = max_iterations
        self.weights = None
        self.bias = None
    
    def _sigmoid(self, z: float) -> float:
        # Clip z to prevent overflow
        z = max(-500, min(500, z))
        return 1 / (1 + math.exp(-z))
    
    def fit(self, X: List[List[float]], y: List[int]):
        n_samples, n_features = len(X), len(X[0])
        self.weights = [0.0] * n_features
        self.bias = 0.0
        
        for _ in range(self.max_iterations):
            # Forward pass
            linear_pred = []
            for sample in X:
                pred = self.bias
                for i, feature in enumerate(sample):
                    pred += self.weights[i] * feature
                linear_pred.append(pred)
            
            y_pred = [self._sigmoid(pred) for pred in linear_pred]
            
            # Compute gradients
            dw = [0.0] * n_features
            db = 0.0
            
            for i in range(n_samples):
                error = y_pred[i] - y[i]
                for j in range(n_features):
                    dw[j] += error * X[i][j]
                db += error
            
            # Update parameters
            for j in range(n_features):
                self.weights[j] -= self.learning_rate * dw[j] / n_samples
            self.bias -= self.learning_rate * db / n_samples
    
    def predict(self, X: List[List[float]]) -> List[int]:
        predictions = []
        for sample in X:
            linear_pred = self.bias
            for i, feature in enumerate(sample):
                linear_pred += self.weights[i] * feature
            prob = self._sigmoid(linear_pred)
            predictions.append(1 if prob >= 0.5 else 0)
        return predictions

# 3. K-Means Clustering Implementation
class KMeans:
    def __init__(self, k=3, max_iterations=100):
        self.k = k
        self.max_iterations = max_iterations
        self.centroids = None
        self.labels = None
    
    def _euclidean_distance(self, point1: List[float], point2: List[float]) -> float:
        return math.sqrt(sum((a - b) ** 2 for a, b in zip(point1, point2)))
    
    def fit(self, X: List[List[float]]):
        n_samples, n_features = len(X), len(X[0])
        
        # Initialize centroids randomly
        self.centroids = []
        for _ in range(self.k):
            centroid = [random.uniform(
                min(X[i][j] for i in range(n_samples)),
                max(X[i][j] for i in range(n_samples))
            ) for j in range(n_features)]
            self.centroids.append(centroid)
        
        for _ in range(self.max_iterations):
            # Assign points to closest centroid
            self.labels = []
            for point in X:
                distances = [self._euclidean_distance(point, centroid) 
                           for centroid in self.centroids]
                self.labels.append(distances.index(min(distances)))
            
            # Update centroids
            new_centroids = []
            for k in range(self.k):
                cluster_points = [X[i] for i in range(n_samples) if self.labels[i] == k]
                if cluster_points:
                    new_centroid = [sum(point[j] for point in cluster_points) / len(cluster_points)
                                  for j in range(n_features)]
                    new_centroids.append(new_centroid)
                else:
                    new_centroids.append(self.centroids[k])
            
            # Check for convergence
            if all(self._euclidean_distance(old, new) < 1e-6 
                   for old, new in zip(self.centroids, new_centroids)):
                break
            
            self.centroids = new_centroids
    
    def predict(self, X: List[List[float]]) -> List[int]:
        predictions = []
        for point in X:
            distances = [self._euclidean_distance(point, centroid) 
                        for centroid in self.centroids]
            predictions.append(distances.index(min(distances)))
        return predictions

# 4. Decision Tree Implementation (simplified)
class DecisionTreeNode:
    def __init__(self, feature=None, threshold=None, left=None, right=None, value=None):
        self.feature = feature
        self.threshold = threshold
        self.left = left
        self.right = right
        self.value = value

class DecisionTree:
    def __init__(self, max_depth=10, min_samples_split=2):
        self.max_depth = max_depth
        self.min_samples_split = min_samples_split
        self.root = None
    
    def _gini_impurity(self, y: List[int]) -> float:
        if not y:
            return 0
        
        classes = list(set(y))
        impurity = 1.0
        
        for cls in classes:
            prob = y.count(cls) / len(y)
            impurity -= prob ** 2
        
        return impurity
    
    def _best_split(self, X: List[List[float]], y: List[int]) -> Tuple[int, float]:
        best_gini = float('inf')
        best_feature = None
        best_threshold = None
        
        n_features = len(X[0])
        
        for feature in range(n_features):
            thresholds = list(set(sample[feature] for sample in X))
            
            for threshold in thresholds:
                left_y = [y[i] for i in range(len(X)) if X[i][feature] <= threshold]
                right_y = [y[i] for i in range(len(X)) if X[i][feature] > threshold]
                
                if len(left_y) == 0 or len(right_y) == 0:
                    continue
                
                gini = (len(left_y) * self._gini_impurity(left_y) + 
                       len(right_y) * self._gini_impurity(right_y)) / len(y)
                
                if gini < best_gini:
                    best_gini = gini
                    best_feature = feature
                    best_threshold = threshold
        
        return best_feature, best_threshold
    
    def _build_tree(self, X: List[List[float]], y: List[int], depth=0) -> DecisionTreeNode:
        # Check stopping criteria
        if (depth >= self.max_depth or 
            len(set(y)) == 1 or 
            len(y) < self.min_samples_split):
            # Return leaf node with most common class
            most_common = max(set(y), key=y.count)
            return DecisionTreeNode(value=most_common)
        
        # Find best split
        feature, threshold = self._best_split(X, y)
        
        if feature is None:
            most_common = max(set(y), key=y.count)
            return DecisionTreeNode(value=most_common)
        
        # Split data
        left_indices = [i for i in range(len(X)) if X[i][feature] <= threshold]
        right_indices = [i for i in range(len(X)) if X[i][feature] > threshold]
        
        left_X = [X[i] for i in left_indices]
        left_y = [y[i] for i in left_indices]
        right_X = [X[i] for i in right_indices]
        right_y = [y[i] for i in right_indices]
        
        # Recursively build subtrees
        left_subtree = self._build_tree(left_X, left_y, depth + 1)
        right_subtree = self._build_tree(right_X, right_y, depth + 1)
        
        return DecisionTreeNode(feature=feature, threshold=threshold,
                              left=left_subtree, right=right_subtree)
    
    def fit(self, X: List[List[float]], y: List[int]):
        self.root = self._build_tree(X, y)
    
    def _predict_sample(self, sample: List[float], node: DecisionTreeNode) -> int:
        if node.value is not None:
            return node.value
        
        if sample[node.feature] <= node.threshold:
            return self._predict_sample(sample, node.left)
        else:
            return self._predict_sample(sample, node.right)
    
    def predict(self, X: List[List[float]]) -> List[int]:
        return [self._predict_sample(sample, self.root) for sample in X]

# 5. Neural Network Implementation (simple)
class NeuralNetwork:
    def __init__(self, input_size, hidden_size, output_size, learning_rate=0.1):
        self.input_size = input_size
        self.hidden_size = hidden_size
        self.output_size = output_size
        self.learning_rate = learning_rate
        
        # Initialize weights randomly
        self.W1 = [[random.uniform(-1, 1) for _ in range(hidden_size)] 
                   for _ in range(input_size)]
        self.b1 = [0.0] * hidden_size
        self.W2 = [[random.uniform(-1, 1) for _ in range(output_size)] 
                   for _ in range(hidden_size)]
        self.b2 = [0.0] * output_size
    
    def _sigmoid(self, x):
        return 1 / (1 + math.exp(-max(-500, min(500, x))))
    
    def _sigmoid_derivative(self, x):
        return x * (1 - x)
    
    def forward(self, X):
        # Hidden layer
        self.z1 = [sum(X[i] * self.W1[i][j] for i in range(self.input_size)) + self.b1[j] 
                   for j in range(self.hidden_size)]
        self.a1 = [self._sigmoid(z) for z in self.z1]
        
        # Output layer
        self.z2 = [sum(self.a1[i] * self.W2[i][j] for i in range(self.hidden_size)) + self.b2[j] 
                   for j in range(self.output_size)]
        self.a2 = [self._sigmoid(z) for z in self.z2]
        
        return self.a2
    
    def backward(self, X, y, output):
        # Output layer gradients
        output_error = [output[i] - y[i] for i in range(self.output_size)]
        output_delta = [output_error[i] * self._sigmoid_derivative(output[i]) 
                       for i in range(self.output_size)]
        
        # Hidden layer gradients
        hidden_error = [sum(output_delta[j] * self.W2[i][j] for j in range(self.output_size)) 
                       for i in range(self.hidden_size)]
        hidden_delta = [hidden_error[i] * self._sigmoid_derivative(self.a1[i]) 
                       for i in range(self.hidden_size)]
        
        # Update weights and biases
        for i in range(self.hidden_size):
            for j in range(self.output_size):
                self.W2[i][j] -= self.learning_rate * output_delta[j] * self.a1[i]
        
        for j in range(self.output_size):
            self.b2[j] -= self.learning_rate * output_delta[j]
        
        for i in range(self.input_size):
            for j in range(self.hidden_size):
                self.W1[i][j] -= self.learning_rate * hidden_delta[j] * X[i]
        
        for j in range(self.hidden_size):
            self.b1[j] -= self.learning_rate * hidden_delta[j]
    
    def train(self, X_train, y_train, epochs=1000):
        for epoch in range(epochs):
            total_loss = 0
            for i in range(len(X_train)):
                output = self.forward(X_train[i])
                self.backward(X_train[i], y_train[i], output)
                
                # Calculate loss
                loss = sum((output[j] - y_train[i][j]) ** 2 for j in range(self.output_size))
                total_loss += loss
            
            if epoch % 100 == 0:
                print(f"Epoch {epoch}, Loss: {total_loss / len(X_train):.4f}")

# 6. Data Preprocessing Utilities
class DataPreprocessor:
    @staticmethod
    def normalize(data: List[List[float]]) -> List[List[float]]:
        """Min-max normalization"""
        if not data or not data[0]:
            return data
        
        n_features = len(data[0])
        normalized_data = []
        
        for j in range(n_features):
            column = [row[j] for row in data]
            min_val = min(column)
            max_val = max(column)
            
            if max_val == min_val:
                continue
            
            for i, row in enumerate(data):
                if j == 0:
                    normalized_data.append([])
                normalized_data[i].append((row[j] - min_val) / (max_val - min_val))
        
        return normalized_data
    
    @staticmethod
    def standardize(data: List[List[float]]) -> List[List[float]]:
        """Z-score standardization"""
        if not data or not data[0]:
            return data
        
        n_features = len(data[0])
        standardized_data = []
        
        for j in range(n_features):
            column = [row[j] for row in data]
            mean = sum(column) / len(column)
            variance = sum((x - mean) ** 2 for x in column) / len(column)
            std = math.sqrt(variance)
            
            if std == 0:
                continue
            
            for i, row in enumerate(data):
                if j == 0:
                    standardized_data.append([])
                standardized_data[i].append((row[j] - mean) / std)
        
        return standardized_data
    
    @staticmethod
    def train_test_split(X: List[List[float]], y: List[Any], test_size=0.2) -> Tuple:
        """Split data into training and testing sets"""
        n_samples = len(X)
        n_test = int(n_samples * test_size)
        
        # Create indices and shuffle
        indices = list(range(n_samples))
        random.shuffle(indices)
        
        test_indices = indices[:n_test]
        train_indices = indices[n_test:]
        
        X_train = [X[i] for i in train_indices]
        X_test = [X[i] for i in test_indices]
        y_train = [y[i] for i in train_indices]
        y_test = [y[i] for i in test_indices]
        
        return X_train, X_test, y_train, y_test

# Demo and Testing
def main():
    print("\\n1. Linear Regression Demo")
    print("-" * 30)
    
    # Generate sample data for linear regression
    X_linear = [[i] for i in range(1, 11)]
    y_linear = [2 * i + 1 + random.uniform(-0.5, 0.5) for i in range(1, 11)]
    
    lr = LinearRegression(learning_rate=0.01, max_iterations=1000)
    lr.fit(X_linear, y_linear)
    
    predictions = lr.predict([[11], [12]])
    print(f"Predictions for [11], [12]: {predictions}")
    print(f"Final cost: {lr.cost_history[-1]:.4f}")
    
    print("\\n2. Logistic Regression Demo")
    print("-" * 30)
    
    # Generate sample data for logistic regression
    X_logistic = [[random.uniform(0, 10), random.uniform(0, 10)] for _ in range(100)]
    y_logistic = [1 if x[0] + x[1] > 10 else 0 for x in X_logistic]
    
    log_reg = LogisticRegression(learning_rate=0.1, max_iterations=1000)
    log_reg.fit(X_logistic, y_logistic)
    
    test_predictions = log_reg.predict([[8, 3], [4, 2]])
    print(f"Logistic predictions: {test_predictions}")
    
    print("\\n3. K-Means Clustering Demo")
    print("-" * 30)
    
    # Generate sample data for clustering
    X_cluster = []
    # Cluster 1
    for _ in range(20):
        X_cluster.append([random.uniform(0, 3), random.uniform(0, 3)])
    # Cluster 2
    for _ in range(20):
        X_cluster.append([random.uniform(7, 10), random.uniform(7, 10)])
    # Cluster 3
    for _ in range(20):
        X_cluster.append([random.uniform(0, 3), random.uniform(7, 10)])
    
    kmeans = KMeans(k=3, max_iterations=100)
    kmeans.fit(X_cluster)
    
    print(f"Cluster centroids: {kmeans.centroids}")
    print(f"First 10 labels: {kmeans.labels[:10]}")
    
    print("\\n4. Decision Tree Demo")
    print("-" * 30)
    
    # Generate sample data for decision tree
    X_tree = [[random.uniform(0, 10), random.uniform(0, 10)] for _ in range(100)]
    y_tree = [1 if x[0] > 5 and x[1] > 5 else 0 for x in X_tree]
    
    dt = DecisionTree(max_depth=5, min_samples_split=5)
    dt.fit(X_tree, y_tree)
    
    tree_predictions = dt.predict([[7, 8], [3, 2]])
    print(f"Decision tree predictions: {tree_predictions}")
    
    print("\\n5. Neural Network Demo")
    print("-" * 30)
    
    # XOR problem
    X_nn = [[0, 0], [0, 1], [1, 0], [1, 1]]
    y_nn = [[0], [1], [1], [0]]
    
    nn = NeuralNetwork(input_size=2, hidden_size=4, output_size=1, learning_rate=0.5)
    print("Training neural network on XOR problem...")
    nn.train(X_nn, y_nn, epochs=1000)
    
    print("\\nTesting neural network:")
    for i, x in enumerate(X_nn):
        prediction = nn.forward(x)
        print(f"Input: {x}, Expected: {y_nn[i][0]}, Predicted: {prediction[0]:.4f}")
    
    print("\\n6. Data Preprocessing Demo")
    print("-" * 30)
    
    # Sample data
    raw_data = [[1, 100], [2, 200], [3, 300], [4, 400], [5, 500]]
    
    normalized = DataPreprocessor.normalize(raw_data)
    print(f"Normalized data: {normalized[:3]}...")
    
    standardized = DataPreprocessor.standardize(raw_data)
    print(f"Standardized data: {standardized[:3]}...")
    
    # Train-test split
    X_split = [[i, i*2] for i in range(20)]
    y_split = [i % 2 for i in range(20)]
    
    X_train, X_test, y_train, y_test = DataPreprocessor.train_test_split(
        X_split, y_split, test_size=0.3
    )
    
    print(f"Train set size: {len(X_train)}, Test set size: {len(X_test)}")
    
    print("\\n✅ Machine Learning concepts demonstration completed!")

if __name__ == "__main__":
    main()`;

      default:
        return `// Welcome to Olive Code Editor!
console.log("Hello, World!");

// Start coding here...
const message = "Ready to code!";
console.log(message);`;
    }
  };

  useEffect(() => {
    const initializeMonaco = async () => {
      if (typeof window !== 'undefined' && (window as any).require) {
        (window as any).require.config({ 
          paths: { 
            vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs' 
          } 
        });

        (window as any).require(['vs/editor/editor.main'], () => {
          if (!monacoRef.current) {
            monacoRef.current = (window as any).monaco;
            
            // Define custom theme
            monacoRef.current.editor.defineTheme('olive-pro', {
              base: isDarkMode ? 'vs-dark' : 'vs',
              inherit: true,
              rules: [
                { token: 'comment', foreground: isDarkMode ? '6A9955' : '008000', fontStyle: 'italic' },
                { token: 'keyword', foreground: isDarkMode ? '569CD6' : '0000FF', fontStyle: 'bold' },
                { token: 'string', foreground: isDarkMode ? 'CE9178' : 'A31515' },
                { token: 'number', foreground: isDarkMode ? 'B5CEA8' : '098658' },
                { token: 'function', foreground: isDarkMode ? 'DCDCAA' : '795E26' },
                { token: 'variable', foreground: isDarkMode ? '9CDCFE' : '001080' },
              ],
              colors: {
                'editor.background': isDarkMode ? '#1e1e1e' : '#ffffff',
                'editor.foreground': isDarkMode ? '#d4d4d4' : '#000000',
                'editor.lineHighlightBackground': isDarkMode ? '#2d2d30' : '#f0f0f0',
                'editor.selectionBackground': isDarkMode ? '#264f78' : '#add6ff',
                'editorCursor.foreground': isDarkMode ? '#ffffff' : '#000000',
                'editorLineNumber.foreground': isDarkMode ? '#858585' : '#237893',
                'editorLineNumber.activeForeground': isDarkMode ? '#ffffff' : '#0B216F',
                'editor.inactiveSelectionBackground': isDarkMode ? '#3a3d41' : '#e5ebf1',
              }
            });
          }

          if (containerRef.current && !editorRef.current) {
            const language = getLanguageFromFile(activeFile);
            const sampleCode = getSampleCode(activeFile);

            editorRef.current = monacoRef.current.editor.create(containerRef.current, {
              value: sampleCode,
              language: language,
              theme: 'olive-pro',
              fontSize: 14,
              lineHeight: 21,
              fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
              fontLigatures: true,
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: 'on',
              lineNumbers: 'on',
              glyphMargin: true,
              folding: true,
              lineDecorationsWidth: 10,
              lineNumbersMinChars: 3,
              renderLineHighlight: 'all',
              selectOnLineNumbers: true,
              roundedSelection: false,
              readOnly: false,
              cursorStyle: 'line',
              cursorBlinking: 'blink',
              cursorSmoothCaretAnimation: true,
              smoothScrolling: true,
              multiCursorModifier: 'ctrlCmd',
              formatOnPaste: true,
              formatOnType: true,
              autoIndent: 'full',
              tabSize: 2,
              insertSpaces: true,
              detectIndentation: true,
              trimAutoWhitespace: true,
              dragAndDrop: true,
              links: true,
              colorDecorators: true,
              lightbulb: { enabled: true },
              codeActionsOnSave: {
                "source.fixAll": true
              },
              suggest: {
                showKeywords: true,
                showSnippets: true,
                showFunctions: true,
                showConstructors: true,
                showFields: true,
                showVariables: true,
                showClasses: true,
                showStructs: true,
                showInterfaces: true,
                showModules: true,
                showProperties: true,
                showEvents: true,
                showOperators: true,
                showUnits: true,
                showValues: true,
                showConstants: true,
                showEnums: true,
                showEnumMembers: true,
                showColors: true,
                showFiles: true,
                showReferences: true,
                showFolders: true,
                showTypeParameters: true,
                showIssues: true,
                showUsers: true,
              },
              quickSuggestions: {
                other: true,
                comments: true,
                strings: true
              },
              parameterHints: { enabled: true },
              autoClosingBrackets: 'always',
              autoClosingQuotes: 'always',
              autoSurround: 'languageDefined',
              bracketPairColorization: { enabled: true },
              guides: {
                bracketPairs: true,
                bracketPairsHorizontal: true,
                highlightActiveBracketPair: true,
                indentation: true,
                highlightActiveIndentation: true
              },
              hover: { enabled: true },
              contextmenu: true,
              mouseWheelZoom: true,
              accessibilitySupport: 'auto',
              find: {
                addExtraSpaceOnTop: false,
                autoFindInSelection: 'never',
                seedSearchStringFromSelection: 'always'
              }
            });

            // Add keyboard shortcuts
            editorRef.current.addCommand(monacoRef.current.KeyMod.CtrlCmd | monacoRef.current.KeyCode.Enter, () => {
              const code = editorRef.current.getValue();
              const language = getLanguageFromFile(activeFile);
              onRunCode(code, language);
            });

            editorRef.current.addCommand(monacoRef.current.KeyMod.CtrlCmd | monacoRef.current.KeyCode.KeyS, () => {
              // Save functionality
              console.log('File saved');
            });

            // Listen for content changes
            editorRef.current.onDidChangeModelContent(() => {
              const code = editorRef.current.getValue();
              onCodeChange(code);
            });

            // Add context menu items
            editorRef.current.addAction({
              id: 'run-code',
              label: 'Run Code',
              keybindings: [monacoRef.current.KeyMod.CtrlCmd | monacoRef.current.KeyCode.Enter],
              contextMenuGroupId: 'navigation',
              contextMenuOrder: 1.5,
              run: () => {
                const code = editorRef.current.getValue();
                const language = getLanguageFromFile(activeFile);
                onRunCode(code, language);
              }
            });

            editorRef.current.addAction({
              id: 'format-code',
              label: 'Format Document',
              keybindings: [monacoRef.current.KeyMod.Shift | monacoRef.current.KeyMod.Alt | monacoRef.current.KeyCode.KeyF],
              contextMenuGroupId: 'navigation',
              contextMenuOrder: 1.6,
              run: () => {
                editorRef.current.getAction('editor.action.formatDocument').run();
              }
            });
          }
        });
      }
    };

    initializeMonaco();
  }, [isDarkMode]);

  // Update editor when active file changes
  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const language = getLanguageFromFile(activeFile);
      const sampleCode = getSampleCode(activeFile);
      
      // Update language
      const model = editorRef.current.getModel();
      if (model) {
        monacoRef.current.editor.setModelLanguage(model, language);
        editorRef.current.setValue(sampleCode);
      }
    }
  }, [activeFile]);

  // Update theme when dark mode changes
  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      // Redefine theme with new colors
      monacoRef.current.editor.defineTheme('olive-pro', {
        base: isDarkMode ? 'vs-dark' : 'vs',
        inherit: true,
        rules: [
          { token: 'comment', foreground: isDarkMode ? '6A9955' : '008000', fontStyle: 'italic' },
          { token: 'keyword', foreground: isDarkMode ? '569CD6' : '0000FF', fontStyle: 'bold' },
          { token: 'string', foreground: isDarkMode ? 'CE9178' : 'A31515' },
          { token: 'number', foreground: isDarkMode ? 'B5CEA8' : '098658' },
          { token: 'function', foreground: isDarkMode ? 'DCDCAA' : '795E26' },
          { token: 'variable', foreground: isDarkMode ? '9CDCFE' : '001080' },
        ],
        colors: {
          'editor.background': isDarkMode ? '#1e1e1e' : '#ffffff',
          'editor.foreground': isDarkMode ? '#d4d4d4' : '#000000',
          'editor.lineHighlightBackground': isDarkMode ? '#2d2d30' : '#f0f0f0',
          'editor.selectionBackground': isDarkMode ? '#264f78' : '#add6ff',
          'editorCursor.foreground': isDarkMode ? '#ffffff' : '#000000',
          'editorLineNumber.foreground': isDarkMode ? '#858585' : '#237893',
          'editorLineNumber.activeForeground': isDarkMode ? '#ffffff' : '#0B216F',
          'editor.inactiveSelectionBackground': isDarkMode ? '#3a3d41' : '#e5ebf1',
        }
      });
      
      monacoRef.current.editor.setTheme('olive-pro');
    }
  }, [isDarkMode]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    />
  );
});

CodeEditor.displayName = 'CodeEditor';

export default CodeEditor;