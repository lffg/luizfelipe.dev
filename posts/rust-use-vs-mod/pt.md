---
title: Qual a diferença entre mod e use em Rust?
---

> Este post, advindo da
> [minha resposta](https://pt.stackoverflow.com/a/509776/69296) à pergunta de
> mesmo título no StackOverflow em Português, é temporário. Está aqui somente
> para demonstração inicial.

# `mod`

A palavra-chave `mod` **declara** um módulo em Rust. Módulos são utilizados para
controlar **escopo** e **privacidade**. Para uma introdução ao conceito de
módulos, veja [aqui][1].

O `mod` pode ser utilizada de dois modos diferentes para criar módulos:

1. **Definindo, explicitamente, um bloco**

   ```rust
   //# Arquivo `main.rs`

   mod math {
      pub fn add(a: i64, b: i64) -> i64 { a + b }
      pub fn sub(a: i64, b: i64) -> i64 { add(a, -b) }
   }

   // Podemos utilizar `math::add` e `math::sub` aqui.
   ```

   Acima, criamos um novo módulo, qualificado como `math`. De fora desse módulo,
   para utilizar uma de suas funções expostas, é necessário utilizar o nome do
   módulo.

   Repare que, dentro de `math`, é possível referir à função `add` somente como
   `add` (como fiz para implementar a função `sub`). Mas, de fora do módulo,
   como disse acima, é necessário utilizar `math::add`.

2. **Definindo via outro arquivo**

   ```rust
   //# Arquivo `math.rs`

   pub fn add(a: i64, b: i64) -> i64 { a + b }
   pub fn sub(a: i64, b: i64) -> i64 { add(a, -b) }
   ```

   E:

   ```rust
   //# Arquivo `main.rs`:

   mod math;

   // Podemos utilizar `math::add` e `math::sub` aqui.
   ```

   Note que, sob a perspectiva do `main.rs`, nada mudou. Nele, assim como no
   exemplo anterior, definiu-se um novo módulo, qualificado como `math`. A
   diferença é o local em que o conteúdo do módulo foi definido.

   No caso, quando a diretiva `mod` é utilizada sem definir um bloco
   explicitamente, ela criará um novo módulo com o nome fornecido e buscará o
   conteúdo do módulo em um arquivo com nome correspondente.

   Repare que o módulo _não_ é definido no arquivo `math.rs`. Ou seja, o arquivo
   `math.rs` **não** é a definição de um módulo. Isso é frequentemente um ponto
   de confusão no Rust já que algumas linguagens (como JavaScript) operam
   diferentemente. A definição do módulo ocorre em `main.rs`, através da
   diretiva `mod math`.

Com isso, podemos concluir que um módulo em Rust é criado pela diretiva `mod`. O
conteúdo do arquivo pode ser definido diretamente, com um bloco seguindo
`mod <name>`. Também pode ser definido no arquivo de `<name>.rs`.

---

# `use`

A diretiva `use` é, quando aliada ao `mod`, um ponto de confusão. Em muitas
linguagens (como JavaScript e Python), o conceito de módulos geralmente
associa-se a uma única palavra-chave, como `import`. Rust adota uma abordagem um
pouco diferente e, por isso, pode parecer "estranho". Mas na verdade é bem
simples. Vejamos...

Já vimos que um módulo pode ser definido utilizando a palavra-chave `mod`. A
partir desse momento, poderemos acessar o conteúdo do módulo utilizando um
[**caminho de módulo**][2].

Nos exemplos anteriores, de `main.rs`, o caminho para chegar à função `sum`, do
módulo `math`, é `math::sum`. Se existissem vários módulos aninhados (o que é
comum em Rust), seria algo como [`std::fs::read_to_string`][3]. Nesse caso,
trata-se de uma função chamada `read_to_string`, interior ao módulo `fs` que,
por sua vez, é interior ao módulo `std`.

### Então para que serve o `use`?

Já vou dizer o que o `use` não é. O `use` não é um mecanismo para importar
módulos. Isso significa que o `use` não serve para trazer nada de novo ao
escopo. Tanto é que, se você tentar usar `use` com algo que não está no escopo,
dará erro.

O `use` serve para **encurtar** o [**caminho**][2] a membro(s) de um módulo.

Em relação ao exemplo do começo da pergunta, se, em `main.rs`, fosse utilizada a
função `math::add` várias vezes, seria repetitivo ter que digitar `math::add`
toda vez. Nesse caso, poderia-se fazer:

```rust
mod math; // Define o módulo `math` com os membros de `math.rs`.

// Elevo o "escopo" de `add`. Note que estou, essencialmente,
// encurtando o caminho até o membro (no caso, função) `add`:
use math::add;

// Agora posso chamar como:
math::add(1, 2); // Válido, caminho completo. OU:
add(1, 2); // Também válido (caminho encurtado definido pelo `use`).
```

Repare que, ao fazer `use math::add`, encurta-se o caminho para acessar a função
`add`. Agora, não mais preciso prefixar com `math::`. Apenas `add` já basta.

Em relação ao `std::fs::read_to_string`, geralmente o programador faz isto:

```rust
use std::fs;

// Pode utilizar como:
std::fs::read_to_string("./Cargo.toml");
fs::read_to_string("./Cargo.toml"); // Faz uso do encurtamento criado pelo `use` acima.
```

Mas também poderia ser:

```rust
use std::fs::read_to_string;

// Pode utilizar como:
std::fs::read_to_string("./Cargo.toml");
read_to_string("./Cargo.toml"); // Faz uso do encurtamento criado pelo `use` acima.
```

Então, o `use` (mais detalhes [aqui][4]) pode ser utilizado como meio para
encurtar caminhos de módulos. Em suma, com ou sem o `use`, ainda seríamos
capazes de acessar a função `read_to_string`. A diferença é que o `use` nos
permite abreviar esse caminho. É extremamente útil quando utilizamos o mesmo
caminho várias vezes e se quer evitar repetições.

Não se pode utilizar `use` em algum nome que não existe no escopo atual.

É por isso que deu erro (conforme mostrado na pergunta) fazer isto:

```rust
use foo;
```

O que é `foo`?

É necessário a existência um módulo `foo` definido no escopo para abreviar o
caminho a um de seus membros.

Faltou uma definição `mod foo` antes do `use foo`. Ou uma Crate `foo` definida
como dependência do projeto.

Crates têm seu nome mais superior definido para todos os módulos do projeto. É
por isso que se pode utilizar, por exemplo, `use std::fs` sem fazer um `mod std`
antes. A `std` é uma Crate padrão do Rust. Todas as Crates que você define como
dependência do projeto também são expostas a seus módulos.

---

# TL;DR

O que traz um novo nome ao escopo é o `mod`, e não `use`. O `use` não importa
nada.

Você precisa definir, com a diretiva `mod`, os módulos que você vai usar.
Crates, como o `std` do Rust ou as que você define como dependência do projeto,
são definidas automaticamente pelo Cargo.

O `use` é utilizado para abreviar um caminho que leva a um item de algum módulo.

[1]:
  https://doc.rust-lang.org/book/ch07-02-defining-modules-to-control-scope-and-privacy.html
[2]:
  https://doc.rust-lang.org/book/ch07-03-paths-for-referring-to-an-item-in-the-module-tree.html
[3]: https://doc.rust-lang.org/std/fs/fn.read_to_string.html
[4]: https://doc.rust-lang.org/reference/items/use-declarations.html
