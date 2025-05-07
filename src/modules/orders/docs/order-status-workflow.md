## **Transition Rules**

### **General Transition Rules**

- **Access based on roles**: Only specific roles can transition the order between statuses.
- **Restricted transitions**: Some roles cannot perform certain transitions (e.g., a Client cannot confirm an order).
- **Final states**: `CANCELED` and `COMPLETED` are terminal statuses. No further transitions are allowed.

| Status From | Status To | Allowed Roles    |
|-------------|-----------|------------------|
| NEW         | CANCELED  | Client , Company |
| NEW         | CONFIRMED | Company          |
| CONFIRMED   | COMPLETED | Company          |
| CONFIRMED   | CANCELED  | Company          |

---