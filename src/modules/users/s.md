# Comparison of Manual Instantiation vs Scope.REQUEST in NestJS

## Diagram

```mermaid
graph TD

subgraph Manual Instantiation
    A1[Request 1] --> B1[Controller]
    B1 --> C1[new DynamicFileValidationInterceptor with rulesA]
    C1 --> D1[Interceptor Instance A]

    A2[Request 2] --> B2[Controller]
    B2 --> C2[new DynamicFileValidationInterceptor with rulesB]
    C2 --> D2[Interceptor Instance B]

    NoteMI[Each request manually creates a new instance with its own rules]
end
````

```mermaid
graph TD
subgraph Scope.REQUEST via DI
A3[Request 3] --> B3[Controller]
B3 --> C3[Interceptor injected by NestJS]
C3 --> D3[New Instance per request]
D3 --> E3[Injected rules via VALIDATION_RULES token]

    A4[Request 4] --> B4[Controller]
    B4 --> C4[Interceptor injected by NestJS]
    C4 --> D4[New Instance per request]
    D4 --> E4[Injected rules via VALIDATION_RULES token]

    NoteRQ[Nest creates separate instance per request automatically]
end
````