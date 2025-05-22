
# Filtering System Documentation

## 🔍 Supported Filters

The API supports advanced filtering via query parameters using the following filter types:

| Filter Type | Description                                                                   |
|-------------|-------------------------------------------------------------------------------|
| `search`    | Performs a case-insensitive substring search on specific fields.              |
| `filters`   | Applies equality filters to specific fields.                                  |
| `in`        | Filters to include results where the field value is in the provided list.     |
| `notIn`     | Filters to exclude results where the field value is in the provided list.     |
| `gt`        | Filters results where a field is greater than the provided value.             |
| `gte`       | Filters results where a field is greater than or equal to the provided value. |
| `lt`        | Filters results where a field is less than the provided value.                |
| `lte`       | Filters results where a field is less than or equal to the provided value.    |
| `date`      | Filters by date range.                                                        |
| `sw`        | Filters results where a field starts with the provided value (startsWith).    |
| `ew`        | Filters results where a field ends with the provided value (endsWith).        |
| `limit`     | Limits the number of results returned. The default is 100.                    |
| `offset`    | Skips a specified number of results. The default is 0.                        |
| `sort`      | Applies multi-field sorting with directions.                                  |

---

## 🔧 Usage Examples

### 1. `search`
```http
GET /v1/products?search[name]=shirt
```
- Returns products whose name contains "shirt" (case-insensitive).

---

### 2. `filters`
```http
GET /v1/products?filters[isActive]=true
```
- Returns products with `isActive = true`.

---

### 3. `in`
```http
GET /v1/products?in[categoryId][]=1&in[categoryId][]=2
```
- Returns products where `categoryId` is in `[1, 2]`.

---

### 4. `notIn`
```http
GET /v1/products?notIn[brandId][]=5&notIn[brandId][]=7
```
- Excludes products with `brandId` 5 or 7.

---

### 5. `gt` (Greater Than)
```http
GET /v1/products?gt[price]=50
```
- Returns products where `price > 50`.

---

### 6. `gte` (Greater Than or Equal)
```http
GET /v1/products?gte[rating]=4
```
- Returns products where `rating >= 4`.

---

### 7. `lt` (Less Than)
```http
GET /v1/products?lt[stock]=10
```
- Returns products where `stock < 10`.

---

### 8. `lte` (Less Than or Equal)
```http
GET /v1/products?lte[discount]=20
```
- Returns products where `discount <= 20`.

---

### 9. `date` (Date Range)
```http
GET /v1/products?date[createdAt][from]=2024-01-01&date[createdAt][to]=2024-12-31
```
- Filters products created between Jan 1, 2024 and Dec 31, 2024.

---

### 10. `sw` (Starts With)
```http
GET /v1/products?sw[name]=nabi
```
- Returns products where `name` starts with "nabi."

---

### 11. `ew` (Ends With)
```http
GET /v1/products?ew[email]=com
```
- Returns products where `email` ends with "com."

---

### 12. `sort` (Multi-Field Sort)
```http
GET /v1/products?sort[id]=DESC&sort[maxPrice]=ASC
```
- Sorts products first by `id` descending, then by `maxPrice` ascending.

---

### 13. `limit` and `offset` (Pagination)
```http
GET /v1/products?limit=10&offset=20
```
- `limit`: Specifies the maximum number of items to return (e.g., 10 items per page)
- `offset`: Specifies the number of items to skip (e.g., skip first 20 items)

---

## 🛠 Advanced Notes

- All filters can be combined:
```http
GET /v1/products?search=hat&in[categoryId][]=3&gt[price]=20&lt[price]=100&sw[name]=a&sort[id]=DESC&limit=10&offset=0
```
- All inputs are automatically validated and parsed based on their expected types.
- Pagination parameters (`limit` and `offset`) can be used with any filter combination.
