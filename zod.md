<style> 
.rem25{
font-size:2.5rem;
}
.rem40{
font-size:4.0rem;
}
.rem50{
  font-size:5.0rem;
}
@media (max-width: 576px) {
  .rem25{
    font-size:2rem;
  }
  .rem40{
    font-size:3.0rem;
  }
  .rem50{
    font-size:3.5rem;
  }
}
.red {
color:red;
}
.blue{
color:blue;
}
.code{
background-color:#e9e9e9;
padding :4px;
font-size:0.9rem;
font-weight:700;
}
</style>

Zod 是一個以 TypeScript 為主的巢狀結構宣告和驗證程式庫。我們使用「模式」這個詞來廣義指代任何資料類型，從簡單的字串到複雜的巢狀物件。

Zod 的設計目標是盡可能對開發人員友好。它的目標是消除重複的型別宣告。使用 Zod，你只需宣告一次驗證器，Zod 將自動推斷出靜態的 TypeScript 型別。它很容易將較簡單的型別組合成複雜的資料結構。

其他一些優點包括：

- 零相依性
- 在 Node.js 和所有現代瀏覽器中運作
- 非常小巧：經壓縮後僅佔 8KB
- 不可變性：函式（例如 .optional()）會回傳一個新的實例
- 簡潔、可鏈式語法介面
- 函數式方法：解析而非驗證
- 也可與純 JavaScript 一起使用！不需要使用 TypeScript。

---

依據你的管理套件安裝zod 命令如下

```bash
npm install zod       # npm
yarn add zod          # yarn
bun add zod           # bun
pnpm add zod          # pnpm
```

## 需求

根據官方需求至少必須是typescript4.5以上的版本
另外在tsconfig.json必須開啟strict的選項(通常安裝typescript預設會開啟)

```typescript
{
  // ...
  "compilerOptions": {
    // ...
    "strict": true
  }
}
```

[Zod-Requirements](https://zod.dev/?id=requirements)

## parse驗證

使用parse驗證，如果不是的話會拋出錯誤

```typescript=
import { z } from "zod";

const userSchema = z.object({
  name: z.string(),
  age: z.number().positive(),
  email: z.string().email(),
});

```

```typescript=
const userData = {
  name: "John",
  age: 25,
  email: "john@example.com",
};

try {
  const user = userSchema.parse(userData);
  console.log(user);
} catch (error) {
  console.error(error);
}
```

根據官方網站需要注意的地方<span class="red">zod使用的是deep clone</span>

> [zod-Doc-Schema methods](https://zod.dev/?id=schema-methods)
> IMPORTANT: The value returned by .parse is a deep clone of the variable you passed in.

這時候如果我們嘗試著帶入不符合Schema的的內容
```typescript=
const userData = {
        name: 'John',
        age: 25,
        email: 'john',
    };
```

如下圖
就會跳出紅字的錯誤

![](https://hackmd.io/_uploads/By6dCImon.png)

## safeParse

使用safeParse不會造成error並且會回傳物件如果成功的話會回傳成功的布林值和data

如下圖

![](https://hackmd.io/_uploads/Hyv9rvQs2.png)

```typescript=
//以上省略
const userData = {
        name: 'John',
        age: 25,
        email: 'john@example.com',
    };

const result = userSchema.safeParse(userData);
console.log(result);
```

```typescript=
//以上省略
const userData = {
    name: 'John',
    age: 25,
    email: 'john',
};

const result = userSchema.safeParse(userData);
console.log(result);
if (result.success) {
    const user = result.data;
    console.log(user);
} else {
    const validationErrors = result.error.issues;
    console.error(validationErrors);
}
```

如果錯誤的話success會回傳false並且回傳一個error物件
如下圖

![](https://hackmd.io/_uploads/H1ZMLPXi3.png)

另外通常會使用if else作為錯誤驗證，我們會取用其issue的地方進行錯誤處理

## z.infer

由於我們已經由於我們已經使用zod的schema，因此可以使用z.infer 推斷對應的 TypeScript 型別

```typescript=
type User = ZodInfer<typeof userSchema>;

const user: User = {
  name: "John",
  age: 25,
  email: "john@example.com",
};
```
如同上面的程式碼我們可以使用z.infer的方式建立型別這樣的話，我們就可以藉由typescript的靜態分析得到一些錯誤訊息。


```typescript=
import { z } from "zod";

// 定義使用者模式
const userSchema = z.object({
  name: z.string(), //　name屬性為必填 
  age: z.number().default(18), // age 預設值為 18
  email: z.string().email().optional(), // email 屬性為可選的合法 email 字串
});

// 驗證資料
const userData = {
  name: "John",
  email: "john@example.com",
};

try {
  const user = userSchema.parse(userData); // 解析並驗證 userData 物件
  console.log(user);
} catch (error) {
  console.error(error.issues);000  
}

```
ˋˋˊˇ
常用的情形會建立一個z.object的物件，裡面使用primitie的
  
  

```typescript=
const userSchema = z.object({
  name: z.string().min(3, "名字至少需要3個字"),
  website: z.string().url("網站連結格式不正確"),
});Fㄎ
```

可以使用enum

```typescript=
const userSchema = z.object({
  name: z.string(),
  language: z.enum(["html", "css", "javascript"]),
});
```

```typescript=
import { z } from "zod";

const languageEnum = z.enum(["html", "css", "javascript"]);

const userSchema = z.object({
  name: z.string(),
  language: languageEnum,
});

const userData = {
  name: "John",
  language: "javascript",
};

try {
  const user = userSchema.parse(userData);
  console.log(user);
} catch (error) {
  console.error(error.issues);
}

```
<style> 
.rem25{
font-size:2.5rem;
}
.rem40{
font-size:4.0rem;
}
.rem50{
  font-size:5.0rem;
}
@media (max-width: 576px) {
  .rem25{
    font-size:2rem;
  }
  .rem40{
    font-size:3.0rem;
  }
  .rem50{
    font-size:3.5rem;
  }
}
.red {
color:red;
}
.blue{
color:blue;
}
.code{
background-color:#e9e9e9;
padding :4px;
font-size:0.9rem;
font-weight:700;
}
</style>

Zod 是一個以 TypeScript 為主的巢狀結構宣告和驗證程式庫。我們使用「模式」這個詞來廣義指代任何資料類型，從簡單的字串到複雜的巢狀物件。

Zod 的設計目標是盡可能對開發人員友好。它的目標是消除重複的型別宣告。使用 Zod，你只需宣告一次驗證器，Zod 將自動推斷出靜態的 TypeScript 型別。它很容易將較簡單的型別組合成複雜的資料結構。

其他一些優點包括：

- 零相依性
- 在 Node.js 和所有現代瀏覽器中運作
- 非常小巧：經壓縮後僅佔 8KB
- 不可變性：函式（例如 .optional()）會回傳一個新的實例
- 簡潔、可鏈式語法介面
- 函數式方法：解析而非驗證
- 也可與純 JavaScript 一起使用！不需要使用 TypeScript。

---

依據你的管理套件安裝zod 命令如下

```bash
npm install zod       # npm
yarn add zod          # yarn
bun add zod           # bun
pnpm add zod          # pnpm
```

## 需求

根據官方需求至少必須是typescript4.5以上的版本
另外在tsconfig.json必須開啟strict的選項(通常安裝typescript預設會開啟)

```typescript
{
  // ...
  "compilerOptions": {
    // ...
    "strict": true
  }
}
```

[Zod-Requirements](https://zod.dev/?id=requirements)

## parse驗證

使用parse驗證，如果不是的話會拋出錯誤

```typescript=
import { z } from "zod";

const userSchema = z.object({
  name: z.string(),
  age: z.number().positive(),
  email: z.string().email(),
});

```

```typescript=
const userData = {
  name: "John",
  age: 25,
  email: "john@example.com",
};

try {
  const user = userSchema.parse(userData);
  console.log(user);
} catch (error) {
  console.error(error);
}
```

根據官方網站需要注意的地方<span class="red">zod使用的是deep clone</span>

> [zod-Doc-Schema methods](https://zod.dev/?id=schema-methods)
> IMPORTANT: The value returned by .parse is a deep clone of the variable you passed in.

這時候如果我們嘗試著帶入不符合Schema的的內容
```typescript=
const userData = {
        name: 'John',
        age: 25,
        email: 'john',
    };
```

如下圖
就會跳出紅字的錯誤

![](https://hackmd.io/_uploads/By6dCImon.png)

## safeParse

使用safeParse不會造成error並且會回傳物件如果成功的話會回傳成功的布林值和data

如下圖

![](https://hackmd.io/_uploads/Hyv9rvQs2.png)

```typescript=
//以上省略
const userData = {
        name: 'John',
        age: 25,
        email: 'john@example.com',
    };

const result = userSchema.safeParse(userData);
console.log(result);
```

```typescript=
//以上省略
const userData = {
    name: 'John',
    age: 25,
    email: 'john',
};

const result = userSchema.safeParse(userData);
console.log(result);
if (result.success) {
    const user = result.data;
    console.log(user);
} else {
    const validationErrors = result.error.issues;
    console.error(validationErrors);
}
```

如果錯誤的話success會回傳false並且回傳一個error物件
如下圖

![](https://hackmd.io/_uploads/H1ZMLPXi3.png)

另外通常會使用if else作為錯誤驗證，我們會取用其issue的地方進行錯誤處理

## z.infer

由於我們已經由於我們已經使用zod的schema，因此可以使用z.infer 推斷對應的 TypeScript 型別

```typescript=
type User = ZodInfer<typeof userSchema>;

const user: User = {
  name: "John",
  age: 25,
  email: "john@example.com",
};
```
如同上面的程式碼我們可以使用z.infer的方式建立型別這樣的話，我們就可以藉由typescript的靜態分析得到一些錯誤訊息。


```typescript=
import { z } from "zod";

// 定義使用者模式
const userSchema = z.object({
  name: z.string(), //　name屬性為必填 
  age: z.number().default(18), // age 預設值為 18
  email: z.string().email().optional(), // email 屬性為可選的合法 email 字串
});

// 驗證資料
const userData = {
  name: "John",
  email: "john@example.com",
};

try {
  const user = userSchema.parse(userData); // 解析並驗證 userData 物件
  console.log(user);
} catch (error) {
  console.error(error.issues);000  
}

```
常用的情形會建立一個z.object的物件，裡面使用primitive的物件

```typescript=
const userSchema = z.object({
  name: z.string().min(3, "名字至少需要3個字"),
  website: z.string().url("網站連結格式不正確"),
});Fㄎ
```

可以使用enum

```typescript=
const userSchema = z.object({
  name: z.string(),
  language: z.enum(["html", "css", "javascript"]),
});
```

```typescript=
import { z } from "zod";

const languageEnum = z.enum(["html", "css", "javascript"]);

const userSchema = z.object({
  name: z.string(),
  language: languageEnum,
});

const userData = {
  name: "John",
  language: "javascript",
};

try {
  const user = userSchema.parse(userData);
  console.log(user);
} catch (error) {
  console.error(error.issues);
}

```


可以使用nativeEnum的範例
```typescript=
enum Language {
  HTML = "html",
  CSS = "css",
  JavaScript = "javascript",
}

const userSchema = z.object({
  name: z.string(),
  language: z.nativeEnum(Language),
});
```


## 組合 Schema: 使用 or 與 and
Tuple：在 Zod 中，你可以用 `z.tuple()` 建立一個 tuple schema。例如：

   ```javascript
   const myTuple = z.tuple([z.string(), z.number()]);
   const data = myTuple.parse(['Hello', 123]); // Passes
   ```



在 Zod 中，Tuple 可以和 Rest 一起使用，這樣就可以創建一個有固定元素並且可以接受更多元素的 Tuple。例如：

   ```javascript
   const TupleSchema = z.tuple([z.string(), z.number(), z.rest(z.boolean())]);
   const data = TupleSchema.parse(['Hello', 123, true, false, true]); // Passes
   ```

   在這個範例中，前兩個元素的型別是固定的（第一個是 string，第二個是 number），而 rest 操作符允許你加入更多的 boolean 型別元素。

3. Union：你可以用 `z.union()` 建立一個 union schema。例如：

   ```javascript
   const stringOrNumber = z.union([z.string(), z.number()]);
   stringOrNumber.parse('Hello'); // Passes
   stringOrNumber.parse(123); // Passes
   ```

4. Zod 也允許你用 `or` 與 `and` 來組合 schema。例如：

   ```javascript
   const stringAndNumber = z.string().and(z.number()); // Intersection
   const stringOrNumber = z.string().or(z.number()); // Union
   ```

5. `partial()`：你可以用這個函數來建立一個 schema 的部分版本，其中所有的鍵都是選擇性的。

   ```javascript
   const UserSchema = z.object({
     name: z.string(),
     age: z.number(),
   });

   const PartialUserSchema = UserSchema.partial();
   PartialUserSchema.parse({}); // Passes
   ```

6. `pick()` 和 `omit()`：這兩個方法分別可以用來挑選與忽略一個物件 schema 的某些鍵。

   ```javascript
   const UserSchema = z.object({
     name: z.string(),
     age: z.number(),
     city: z.string(),
   });

   const PickedUserSchema = UserSchema.pick({ name: true, age: true });
   const OmittedUserSchema = UserSchema.omit({ city: true });
   ```

7. 關於 `z.infer<typeof UserSchema>` 的使用，以下有一個範例：

   ```javascript
   const UserSchema = z.object({
     name: z.string(),
     age: z.number().optional(),
   });

   type User = z.infer<typeof UserSchema>;
   // 等同於 type User = { name: string; age?: number; }

   const user: User = {
     name: 'John',
     age: 30,
   };
   ```

   在上面的範例中，`z.infer<typeof UserSchema>` 是將 UserSchema 轉換為 TypeScript 的型別，然後我們就可以將這個型別用於宣告變數。

8. `safeParse()`：這個方法會嘗試解析一個值，並回傳一個物件，其中包含解析的結果與可能發生的錯誤。例如：

   ```javascript
   const result = UserSchema.safeParse({ name: 'John', age: '30' });

   if (result.success) {
     console.log(result.data);
   } else {
     console.log(result.error.issues);
   }
   ```

9. `default()`：你可以用這個方法來設定一個預設值給你的 schema。例如：

   ```javascript
   const UserSchema = z.object({
     name: z.string().default('John'),
     age: z.number().default(30),
   });
   ```

z.date

使用者輸入可能用safeParse然後　API回傳錯誤可能會用普通的parse

number().gt()

nullable = only null

nullish() = undefined and null

z.literal() 可以保證它一定是某些值否則會噴錯

deepPartial()

passthrough

strict

z.array(z.string())











待理解

https://blog.testdouble.com/posts/2023-01-30-zod-runtime-type-safety/

https://blog.logrocket.com/schema-validation-typescript-zod/

可以使用nativeEnum的範例
```typescript=
enum Language {
  HTML = "html",
  CSS = "css",
  JavaScript = "javascript",
}

const userSchema = z.object({
  name: z.string(),
  language: z.nativeEnum(Language),
});
```


## 組合 Schema: 使用 or 與 and
Tuple：在 Zod 中，你可以用 `z.tuple()` 建立一個 tuple schema。例如：

   ```javascript
   const myTuple = z.tuple([z.string(), z.number()]);
   const data = myTuple.parse(['Hello', 123]); // Passes
   ```



在 Zod 中，Tuple 可以和 Rest 一起使用，這樣就可以創建一個有固定元素並且可以接受更多元素的 Tuple。例如：

   ```javascript
   const TupleSchema = z.tuple([z.string(), z.number(), z.rest(z.boolean())]);
   const data = TupleSchema.parse(['Hello', 123, true, false, true]); // Passes
   ```

   在這個範例中，前兩個元素的型別是固定的（第一個是 string，第二個是 number），而 rest 操作符允許你加入更多的 boolean 型別元素。

3. Union：你可以用 `z.union()` 建立一個 union schema。例如：

   ```javascript
   const stringOrNumber = z.union([z.string(), z.number()]);
   stringOrNumber.parse('Hello'); // Passes
   stringOrNumber.parse(123); // Passes
   ```

4. Zod 也允許你用 `or` 與 `and` 來組合 schema。例如：

   ```javascript
   const stringAndNumber = z.string().and(z.number()); // Intersection
   const stringOrNumber = z.string().or(z.number()); // Union
   ```

5. `partial()`：你可以用這個函數來建立一個 schema 的部分版本，其中所有的鍵都是選擇性的。

   ```javascript
   const UserSchema = z.object({
     name: z.string(),
     age: z.number(),
   });

   const PartialUserSchema = UserSchema.partial();
   PartialUserSchema.parse({}); // Passes
   ```

6. `pick()` 和 `omit()`：這兩個方法分別可以用來挑選與忽略一個物件 schema 的某些鍵。

   ```javascript
   const UserSchema = z.object({
     name: z.string(),
     age: z.number(),
     city: z.string(),
   });

   const PickedUserSchema = UserSchema.pick({ name: true, age: true });
   const OmittedUserSchema = UserSchema.omit({ city: true });
   ```

7. 關於 `z.infer<typeof UserSchema>` 的使用，以下有一個範例：

   ```javascript
   const UserSchema = z.object({
     name: z.string(),
     age: z.number().optional(),
   });

   type User = z.infer<typeof UserSchema>;
   // 等同於 type User = { name: string; age?: number; }

   const user: User = {
     name: 'John',
     age: 30,
   };
   ```

   在上面的範例中，`z.infer<typeof UserSchema>` 是將 UserSchema 轉換為 TypeScript 的型別，然後我們就可以將這個型別用於宣告變數。

8. `safeParse()`：這個方法會嘗試解析一個值，並回傳一個物件，其中包含解析的結果與可能發生的錯誤。例如：

   ```javascript
   const result = UserSchema.safeParse({ name: 'John', age: '30' });

   if (result.success) {
     console.log(result.data);
   } else {
     console.log(result.error.issues);
   }
   ```

9. `default()`：你可以用這個方法來設定一個預設值給你的 schema。例如：

   ```javascript
   const UserSchema = z.object({
     name: z.string().default('John'),
     age: z.number().default(30),
   });
   ```


z.date

使用者輸入可能用safeParse然後　API回傳錯誤可能會用普通的parse

number().gt()

nullable = only null

nullish() = undefined and null

z.literal() 可以保證它一定是某些值否則會噴錯

deepPartial()

passthrough

strict

z.array(z.string())











待理解

https://blog.testdouble.com/posts/2023-01-30-zod-runtime-type-safety/

https://blog.logrocket.com/schema-validation-typescript-zod/