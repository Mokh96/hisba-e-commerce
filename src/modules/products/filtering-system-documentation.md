# Filtering System Documentation

## 🔍 Supported Filters

The API supports advanced filtering via query parameters using the following filter types:


| Filter Type | Description                                                                                                                              |
|-------------|------------------------------------------------------------------------------------------------------------------------------------------|
| `search`    | Performs a search on specific fields using a term. For example: ?search[code]=af46be7a-b2db searches the code field for the exact value. |
| `filters`   | Applies equality filters to specific fields. Example: ?filters[isActive]=true.                                                           |
| `in`        | Filters to include results where the field value is in the provided list. Example: ?in[categoryId][]=1&in[categoryId][]=2.               |
| `notIn`     | Filters to exclude results where the field value is in the provided list. Example: ?notIn[status][]=archive                              |
| `gt`        | Filters results where a field is greater than the provided value. Example: ?gt[price]=100.                                               |
| `gte`       | Filters results where a field is greater than the provided value. Example: ?gt[price]=100.                                               |
| `lt`        | Filters results where a field is less than the provided value. Example: ?lt[stock]=50.                                                   |
| `lte`       | Filters results where a field is less than the provided value. Example: ?lt[stock]=50.                                                   |
| `date`      | Filters by date range for fields like createdAt or updatedAt. Example: ?date[createdAt][from]=2024-01-01&date[createdAt][to]=2024-12-31. |

---

## 🔧 Usage Examples

### 1. `search`

```http
GET /v1/products?search[name]=shirt
```

- Returns products whose name contains "shirt."

---

### 2. `in`

```http
GET /v1/products?in[categoryId][]=1&in[categoryId][]=2
```

- Returns products whose `categoryId` is in `[1, 2]`.
- Auto-expands to include all descendant categories.

---

### 3. `notIn`

```http
GET /v1/products?notIn[brandId][]=5&notIn[brandId][]=7
```

- Excludes products with `brandId` 5 or 7.

---

### 4. `gt` (Greater Than)

```http
GET /v1/products?gt[price]=50
```

- Returns products where `price > 50`.

---

### 5. `gte` (Greater Than or Equal)

```http
GET /v1/products?gte[rating]=4
```

- Returns products where `rating >= 4`.

---

### 6. `lt` (Less Than)

```http
GET /v1/products?lt[stock]=10
```

- Returns products where `stock < 10`.

---

### 7. `lte` (Less Than or Equal)

```http
GET /v1/products?lte[discount]=20
```

- Returns products where `discount <= 20`.

---

### 8. `date` (Date Ranges)

```http
GET /v1/products?createdAt[from]=2024-01-01&createdAt[to]=2024-12-31
```

- Filters products created between Jan 1, 2024 and Dec 31, 2024.

```http
GET /v1/products?updatedAt[from]=2024-05-01
```

- Filters products updated **after** May 1, 2024.

---

## 🛠 Advanced Notes

- All filters are **combinable**:

```http
GET /v1/products?search=hat&in[categoryId][]=3&gt[price]=20&lt[price]=100
```

- Filters are automatically transformed based on their type definitions (e.g., numbers, dates).