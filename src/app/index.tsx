
import { useState } from 'react';
import {
  View, Text, TextInput, Pressable, ScrollView, StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const ROXO = '#7026A6';
const CLARO = '#F3E8FC';

type ItemPedido = {
  nome: string;
  detalhes: string;
  preco: number;
};

type Pedido = {
  numero: number;
  itens: ItemPedido[];
  total: number;
  data: string;
  status: string;
  endereco: string;
  pagamento: string;
};

const tamanhos = [
  { nome: 'P — 300 ml', preco: 15 },
  { nome: 'M — 500 ml', preco: 22 },
  { nome: 'G — 700 ml', preco: 29 },
  { nome: 'GG — 1 litro', preco: 38 },
];

const tiposAcai = [
  {
    nome: 'Açaí tradicional',
    descricao: 'Polpa de açaí cremosa.',
  },
  {
    nome: 'Açaí com banana',
    descricao: 'Açaí batido com banana.',
  },
  {
    nome: 'Açaí zero',
    descricao: 'Opção sem adição de açúcar.',
  },
];

const acompanhamentos = [
  { nome: 'Banana', preco: 0 },
  { nome: 'Granola artesanal', preco: 0 },
  { nome: 'Paçoca', preco: 0 },
  { nome: 'Leite condensado', preco: 0 },
  { nome: 'Nutella', preco: 3 },
  { nome: 'Morango', preco: 2 },
  { nome: 'Leite em pó', preco: 2 },
  { nome: 'Confete', preco: 2 },
];

const saboresPet = [
  'Banana',
  'Morango',
  'Melancia',
  'Manga',
];

const acompanhamentosPet = [
  'Banana em pedaços',
  'Maçã sem sementes',
  'Melancia sem sementes',
  'Cenoura em pedaços pequenos',
];

const etapas = [
  'Pedido recebido',
  'Em preparação',
  'Saiu para entrega',
  'Pedido entregue',
];

const produtos = [
  {
    nome: 'Açaí tradicional',
    categoria: 'Açaí',
    emoji: '🍇',
    descricao: 'Polpa cremosa com acompanhamentos à escolha.',
    preco: 'A partir de R$ 15,00',
    destino: 'personalizarAcai',
  },
  {
    nome: 'Açaí zero',
    categoria: 'Açaí',
    emoji: '🥣',
    descricao: 'Opção sem adição de açúcar.',
    preco: 'A partir de R$ 15,00',
    destino: 'personalizarAcai',
  },
  {
    nome: 'Sorvete de maracujá',
    categoria: 'Sorvetes',
    emoji: '🍨',
    descricao: 'Sorvete de maracujá; ingredientes a confirmar.',
    preco: 'R$ 10,00',
    destino: 'sorveteMaracuja',
  },
  {
    nome: 'Sorvete natural Pet',
    categoria: 'Pet',
    emoji: '🐶',
    descricao: 'Frutas batidas com água, sem açúcar adicionado.',
    preco: 'R$ 12,00',
    destino: 'personalizarPet',
  },
  {
    nome: 'Granola artesanal',
    categoria: 'Acompanhamentos',
    emoji: '🥣',
    descricao: 'Acompanhamento crocante para o açaí.',
    preco: 'R$ 8,00',
    destino: 'granola',
  },
];

function dinheiro(valor: number) {
  return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

export default function HomeScreen() {
  const [tela, setTela] = useState('inicio');

  const [nomeCliente, setNomeCliente] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');

  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('Todos');

  const [tamanho, setTamanho] = useState(tamanhos[0].nome);
  const [tipoAcai, setTipoAcai] = useState(tiposAcai[0].nome);
  const [extras, setExtras] = useState<string[]>([]);
  const [monteEmCasa, setMonteEmCasa] = useState(false);

  const [saborPet, setSaborPet] = useState(saboresPet[0]);
  const [extrasPet, setExtrasPet] = useState<string[]>([]);

  const [carrinho, setCarrinho] = useState<ItemPedido[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pedidoSelecionado, setPedidoSelecionado] =
    useState<Pedido | null>(null);

  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [complemento, setComplemento] = useState('');
  const [referencia, setReferencia] = useState('');
  const [observacao, setObservacao] = useState('');

  const [pagamento, setPagamento] = useState('Pix');
  const [troco, setTroco] = useState('');

  const [pontos, setPontos] = useState(0);
  const [historicoPontos, setHistoricoPontos] =
    useState<string[]>([]);
  const [usarPontosEm, setUsarPontosEm] = useState('Nenhum');

  const [etapaAtual, setEtapaAtual] = useState(0);
  const [pedidoNumero, setPedidoNumero] = useState(1000);
  const [pedidoConcluido, setPedidoConcluido] = useState(false);

  const [avaliacao, setAvaliacao] = useState(0);
  const [comentario, setComentario] = useState('');
  const [mensagem, setMensagem] = useState('');

  const [adminAba, setAdminAba] = useState('Dashboard');
  const [estadoApi, setEstadoApi] =
    useState('Conexão demonstrativa');

  const filtrados = produtos.filter((produto) =>
    (categoria === 'Todos' ||
      produto.categoria === categoria) &&
    `${produto.nome} ${produto.descricao}`
      .toLowerCase()
      .includes(busca.toLowerCase())
  );

  const precoTamanho =
    tamanhos.find((item) => item.nome === tamanho)?.preco ?? 15;

  const precoExtras = extras.reduce(
    (soma, nome) =>
      soma +
      (acompanhamentos.find((item) => item.nome === nome)?.preco ?? 0),
    0
  );

  const total = carrinho.reduce(
    (soma, item) => soma + item.preco,
    0
  );

  const pontosPorCompra =
    total <= 30 ? 1 :
    total <= 60 ? 2 :
    total <= 90 ? 3 : 5;

  const percentualDesconto =
    pontos >= 100 ? 0.5 :
    pontos >= 60 ? 0.3 :
    pontos >= 30 ? 0.2 :
    pontos >= 10 ? 0.1 : 0;

  const descontoPedido =
    usarPontosEm === 'Pedido'
      ? total * percentualDesconto
      : 0;

  const totalFinal = Math.max(0, total - descontoPedido);

  function alternarExtra(nome: string) {
    setExtras((atual) =>
      atual.includes(nome)
        ? atual.filter((item) => item !== nome)
        : [...atual, nome]
    );
  }

  function alternarExtraPet(nome: string) {
    setExtrasPet((atual) =>
      atual.includes(nome)
        ? atual.filter((item) => item !== nome)
        : [...atual, nome]
    );
  }

  function adicionarAcai() {
    const adicionais = extras.length
      ? extras.join(', ')
      : 'Sem adicionais';

    const preparo = monteEmCasa
      ? 'Monte em Casa: potes individuais'
      : 'Açaí montado';

    setCarrinho((atual) => [
      ...atual,
      {
        nome: tipoAcai,
        detalhes: `${tamanho} • ${preparo} • ${adicionais}`,
        preco: precoTamanho + precoExtras,
      },
    ]);

    setExtras([]);
    setMonteEmCasa(false);
    setMensagem('');
    setTela('carrinho');
  }

  function adicionarPet() {
    const cobrados = Math.max(0, extrasPet.length - 2);

    setCarrinho((atual) => [
      ...atual,
      {
        nome: `Sorvete Pet de ${saborPet}`,
        detalhes: extrasPet.length
          ? extrasPet.join(', ')
          : 'Sem acompanhamentos',
        preco: 12 + cobrados * 1.5,
      },
    ]);

    setExtrasPet([]);
    setMensagem('');
    setTela('carrinho');
  }

  function adicionarProdutoSimples(
    nome: string,
    preco: number,
    detalhes: string
  ) {
    setCarrinho((atual) => [
      ...atual,
      { nome, preco, detalhes },
    ]);
    setTela('carrinho');
  }

  function abrirProduto(
    destino: string,
    nomeProduto?: string
  ) {
    if (nomeProduto === 'Açaí zero') {
      setTipoAcai('Açaí zero');
    } else if (nomeProduto === 'Açaí tradicional') {
      setTipoAcai('Açaí tradicional');
    }

    setMensagem('');
    setTela(destino);
  }

  function opcao(
    nome: string,
    selecionado: boolean,
    acao: () => void,
    descricao?: string
  ) {
    return (
      <Pressable
        key={nome}
        style={[
          styles.opcao,
          selecionado && styles.opcaoAtiva,
        ]}
        onPress={acao}
      >
        <Text style={styles.opcaoTexto}>
          {selecionado ? '☑' : '☐'} {nome}
        </Text>
        {descricao ? (
          <Text style={styles.pequeno}>{descricao}</Text>
        ) : null}
      </Pressable>
    );
  }

  function titulo(texto: string) {
    return <Text style={styles.titulo}>{texto}</Text>;
  }

  function botao(texto: string, acao: () => void) {
    return (
      <Pressable style={styles.botao} onPress={acao}>
        <Text style={styles.botaoTexto}>{texto}</Text>
      </Pressable>
    );
  }

  function voltar(
    texto = '← Voltar',
    destino = 'cardapio'
  ) {
    return (
      <Pressable
        style={styles.voltar}
        onPress={() => setTela(destino)}
      >
        <Text style={styles.textoRoxo}>{texto}</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.cabecalho}>
        <Pressable onPress={() => setTela('cardapio')}>
          <Text style={styles.logo}>MB AÇAÍTERIA</Text>
        </Pressable>

        <View style={styles.menuTopo}>
          <Pressable onPress={() => setTela('cardapio')}>
            <Text style={styles.link}>Cardápio</Text>
          </Pressable>
          <Pressable onPress={() => setTela('carrinho')}>
            <Text style={styles.link}>
              🛒 ({carrinho.length})
            </Text>
          </Pressable>
          <Pressable onPress={() => setTela('perfil')}>
            <Text style={styles.link}>Perfil</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.conteudo}
      >
        {mensagem ? (
          <Text style={styles.mensagem}>{mensagem}</Text>
        ) : null}

        {tela === 'inicio' && (
          <View style={styles.centralizado}>
            <Text style={styles.emojiGrande}>🍇</Text>
            {titulo('Bem-vindo à MB Açaíteria!')}
            <Text style={styles.texto}>
              Seu açaí favorito, do seu jeito.
            </Text>
            {botao('Entrar', () => setTela('login'))}
            {botao('Criar cadastro', () => setTela('cadastro'))}
            {botao('Ver cardápio', () => setTela('cardapio'))}
          </View>
        )}

        {tela === 'login' && (
          <View>
            {voltar('← Início', 'inicio')}
            {titulo('Entrar')}
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />
            {botao('Entrar', () => {
              if (!email || !senha) {
                setMensagem('Preencha o e-mail e a senha.');
                return;
              }
              setMensagem('');
              setTela('cardapio');
            })}
            <Pressable onPress={() => setTela('cadastro')}>
              <Text style={styles.textoRoxo}>
                Ainda não tem conta? Cadastre-se.
              </Text>
            </Pressable>
          </View>
        )}

        {tela === 'cadastro' && (
          <View>
            {voltar('← Início', 'inicio')}
            {titulo('Criar cadastro')}
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              value={nomeCliente}
              onChangeText={setNomeCliente}
            />
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Telefone"
              value={telefone}
              onChangeText={setTelefone}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />
            {botao('Cadastrar', () => {
              if (!nomeCliente || !email || !senha) {
                setMensagem('Preencha nome, e-mail e senha.');
                return;
              }
              setMensagem('Cadastro demonstrativo concluído!');
              setTela('cardapio');
            })}
          </View>
        )}

        {tela === 'cardapio' && (
          <View>
            {titulo('Nosso cardápio')}
            <Text style={styles.texto}>
              Escolha seus produtos favoritos!
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Buscar produto..."
              value={busca}
              onChangeText={setBusca}
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {[
                'Todos',
                'Açaí',
                'Sorvetes',
                'Pet',
                'Acompanhamentos',
              ].map((item) => (
                <Pressable
                  key={item}
                  style={[
                    styles.filtro,
                    categoria === item && styles.filtroAtivo,
                  ]}
                  onPress={() => setCategoria(item)}
                >
                  <Text
                    style={[
                      styles.filtroTexto,
                      categoria === item && styles.filtroTextoAtivo,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {filtrados.map((produto) => (
              <View key={produto.nome} style={styles.produto}>
                <Text style={styles.emoji}>{produto.emoji}</Text>
                <View style={styles.produtoInfo}>
                  <Text style={styles.produtoNome}>
                    {produto.nome}
                  </Text>
                  <Text style={styles.texto}>
                    {produto.descricao}
                  </Text>
                  <Text style={styles.preco}>
                    {produto.preco}
                  </Text>
                  {botao('Escolher', () => {
                    if (produto.nome === 'Sorvete de maracujá') {
                      adicionarProdutoSimples(
                        produto.nome,
                        10,
                        'Sorvete de maracujá'
                      );
                    } else if (produto.nome === 'Granola artesanal') {
                      adicionarProdutoSimples(
                        produto.nome,
                        8,
                        'Em embalagem separada'
                      );
                    } else {
                      abrirProduto(
                        produto.destino,
                        produto.nome
                      );
                    }
                  })}
                </View>
              </View>
            ))}

            {botao('Meu perfil', () => setTela('perfil'))}
            {botao('Meus pedidos', () => setTela('meusPedidos'))}
            {botao('MB Pontos', () => setTela('pontos'))}
          </View>
        )}

        {tela === 'personalizarAcai' && (
          <View>
            {voltar()}
            {titulo('Monte seu açaí')}

            <Text style={styles.subtitulo}>Escolha o tipo</Text>
            {tiposAcai.map((item) =>
              opcao(
                item.nome,
                tipoAcai === item.nome,
                () => setTipoAcai(item.nome),
                item.descricao
              )
            )}

            <Text style={styles.subtitulo}>Escolha o tamanho</Text>
            {tamanhos.map((item) =>
              opcao(
                item.nome,
                tamanho === item.nome,
                () => setTamanho(item.nome),
                dinheiro(item.preco)
              )
            )}

            <Text style={styles.subtitulo}>
              Acompanhamentos
            </Text>
            {acompanhamentos.map((item) =>
              opcao(
                `${item.nome} ${
                  item.preco ? `(+${dinheiro(item.preco)})` : '(grátis)'
                }`,
                extras.includes(item.nome),
                () => alternarExtra(item.nome)
              )
            )}

            {opcao(
              'Monte em Casa',
              monteEmCasa,
              () => setMonteEmCasa(!monteEmCasa),
              'Açaí e acompanhamentos enviados em potes separados.'
            )}

            <View style={styles.resumo}>
              <Text style={styles.texto}>Total do produto</Text>
              <Text style={styles.preco}>
                {dinheiro(precoTamanho + precoExtras)}
              </Text>
            </View>

            {botao('Adicionar ao carrinho', adicionarAcai)}
          </View>
        )}

        {tela === 'personalizarPet' && (
          <View>
            {voltar()}
            {titulo('Linha Pet 🐶')}
            <Text style={styles.texto}>
              Sorvete de frutas com água, sem açúcar adicionado.
              Confirme se os ingredientes são adequados ao seu pet.
            </Text>

            <Text style={styles.subtitulo}>Escolha o sabor</Text>
            {saboresPet.map((sabor) =>
              opcao(
                sabor,
                saborPet === sabor,
                () => setSaborPet(sabor)
              )
            )}

            <Text style={styles.subtitulo}>
              Acompanhamentos Pet
            </Text>
            <Text style={styles.texto}>
              Os dois primeiros são grátis. Cada adicional a partir
              do terceiro custa R$ 1,50.
            </Text>

            {acompanhamentosPet.map((item) =>
              opcao(
                item,
                extrasPet.includes(item),
                () => alternarExtraPet(item)
              )
            )}

            <View style={styles.resumo}>
              <Text style={styles.texto}>Preço estimado</Text>
              <Text style={styles.preco}>
                {dinheiro(
                  12 + Math.max(0, extrasPet.length - 2) * 1.5
                )}
              </Text>
            </View>

            {botao('Adicionar ao carrinho', adicionarPet)}
          </View>
        )}

        
        {tela === 'carrinho' && (
          <View>
            {voltar()}
            {titulo('Meu carrinho')}

            {carrinho.length === 0 ? (
              <Text style={styles.texto}>
                Seu carrinho está vazio.
              </Text>
            ) : (
              carrinho.map((item, index) => (
                <View key={`${item.nome}-${index}`} style={styles.produto}>
                  <View style={styles.produtoInfo}>
                    <Text style={styles.produtoNome}>{item.nome}</Text>
                    <Text style={styles.texto}>{item.detalhes}</Text>
                    <Text style={styles.preco}>{dinheiro(item.preco)}</Text>
                    <Pressable
                      onPress={() =>
                        setCarrinho((atual) =>
                          atual.filter((_, i) => i !== index)
                        )
                      }
                    >
                      <Text style={styles.textoRoxo}>Remover</Text>
                    </Pressable>
                  </View>
                </View>
              ))
            )}

            <Text style={styles.subtitulo}>
              Total: {dinheiro(total)}
            </Text>
            {botao('Continuar comprando', () => setTela('cardapio'))}
            {carrinho.length > 0 &&
              botao('Continuar para entrega', () => setTela('entrega'))}
          </View>
        )}

        {tela === 'entrega' && (
          <View>
            {voltar('← Carrinho', 'carrinho')}
            {titulo('Endereço de entrega')}

            <TextInput
              style={styles.input}
              placeholder="Rua ou avenida"
              value={endereco}
              onChangeText={setEndereco}
            />
            <TextInput
              style={styles.input}
              placeholder="Número"
              value={numero}
              onChangeText={setNumero}
            />
            <TextInput
              style={styles.input}
              placeholder="Bairro"
              value={bairro}
              onChangeText={setBairro}
            />
            <TextInput
              style={styles.input}
              placeholder="Complemento (opcional)"
              value={complemento}
              onChangeText={setComplemento}
            />
            <TextInput
              style={styles.input}
              placeholder="Ponto de referência (opcional)"
              value={referencia}
              onChangeText={setReferencia}
            />
            <TextInput
              style={styles.input}
              placeholder="Observações do pedido"
              value={observacao}
              onChangeText={setObservacao}
            />

            {botao('Usar endereço atual', () =>
              setMensagem(
                'A localização automática precisa ser integrada ao GPS.'
              )
            )}

            {botao('Continuar para pagamento', () => {
              if (!endereco.trim() || !numero.trim() || !bairro.trim()) {
                setMensagem('Preencha rua, número e bairro.');
                return;
              }
              setMensagem('');
              setTela('pagamento');
            })}
          </View>
        )}

        {tela === 'pagamento' && (
          <View>
            {voltar('← Endereço', 'entrega')}
            {titulo('Pagamento')}

            <Text style={styles.subtitulo}>Forma de pagamento</Text>
            {['Pix', 'Cartão de crédito', 'Cartão de débito', 'Dinheiro'].map(
              (item) =>
                opcao(
                  item,
                  pagamento === item,
                  () => setPagamento(item)
                )
            )}

            {pagamento === 'Dinheiro' && (
              <TextInput
                style={styles.input}
                placeholder="Troco para quanto? (opcional)"
                value={troco}
                onChangeText={setTroco}
                keyboardType="numeric"
              />
            )}

            <Text style={styles.subtitulo}>MB Pontos</Text>
            <Text style={styles.texto}>
              Você tem {pontos} pontos.
            </Text>

            {opcao(
              'Não usar pontos',
              usarPontosEm === 'Nenhum',
              () => setUsarPontosEm('Nenhum')
            )}
            {opcao(
              'Usar pontos no pedido',
              usarPontosEm === 'Pedido',
              () => setUsarPontosEm('Pedido')
            )}
            {opcao(
              'Usar pontos na entrega',
              usarPontosEm === 'Entrega',
              () => setUsarPontosEm('Entrega')
            )}

            <View style={styles.resumo}>
              <Text style={styles.texto}>Subtotal</Text>
              <Text style={styles.preco}>{dinheiro(total)}</Text>
              <Text style={styles.texto}>Desconto no pedido</Text>
              <Text style={styles.preco}>
                - {dinheiro(descontoPedido)}
              </Text>
              <Text style={styles.texto}>Total a pagar</Text>
              <Text style={styles.titulo}>{dinheiro(totalFinal)}</Text>
              {usarPontosEm === 'Entrega' && (
                <Text style={styles.pequeno}>
                  A recompensa de entrega grátis será confirmada conforme
                  a disponibilidade de pontos.
                </Text>
              )}
            </View>

            {botao('Confirmar pedido', () => {
              if (!carrinho.length) {
                setMensagem('Seu carrinho está vazio.');
                setTela('carrinho');
                return;
              }

              if (
                usarPontosEm === 'Pedido' &&
                pontos < 10
              ) {
                setMensagem('Você ainda não tem pontos suficientes.');
                return;
              }

              if (
                usarPontosEm === 'Entrega' &&
                pontos < 50
              ) {
                setMensagem('São necessários 50 pontos para entrega grátis.');
                return;
              }

              const novoNumero = pedidoNumero + 1;
              const novoPedido: Pedido = {
                numero: novoNumero,
                itens: [...carrinho],
                total: totalFinal,
                data: new Date().toLocaleDateString('pt-BR'),
                status: 'Pedido recebido',
                endereco: `${endereco}, ${numero}, ${bairro}`,
                pagamento,
              };

              setPedidos((atual) => [novoPedido, ...atual]);
              setPedidoSelecionado(novoPedido);
              setPedidoNumero(novoNumero);
              setEtapaAtual(0);
              setPedidoConcluido(true);

              if (usarPontosEm === 'Entrega') {
                setPontos((atual) => atual - 50);
                setHistoricoPontos((atual) => [
                  '−50 pontos: entrega grátis',
                  ...atual,
                ]);
              } else {
                if (usarPontosEm === 'Pedido') {
                  setPontos((atual) => atual - 10);
                  setHistoricoPontos((atual) => [
                    '−10 pontos: desconto no pedido',
                    ...atual,
                  ]);
                }
                setPontos((atual) => atual + pontosPorCompra);
                setHistoricoPontos((atual) => [
                  `+${pontosPorCompra} pontos pela compra`,
                  ...atual,
                ]);
              }

              setCarrinho([]);
              setUsarPontosEm('Nenhum');
              setMensagem('');
              setTela('confirmacao');
            })}
          </View>
        )}

        {tela === 'confirmacao' && (
          <View style={styles.centralizado}>
            <Text style={styles.emojiGrande}>✅</Text>
            {titulo('Pedido confirmado!')}
            <Text style={styles.texto}>
              Número do pedido: #{pedidoSelecionado?.numero}
            </Text>
            <Text style={styles.texto}>
              Total: {dinheiro(pedidoSelecionado?.total ?? 0)}
            </Text>
            <Text style={styles.texto}>
              Endereço: {pedidoSelecionado?.endereco}
            </Text>
            {botao('Acompanhar pedido', () => setTela('rastreamento'))}
            {botao('Meus pedidos', () => setTela('meusPedidos'))}
            {botao('Voltar ao cardápio', () => setTela('cardapio'))}
          </View>
        )}

        {tela === 'rastreamento' && (
          <View>
            {voltar('← Meus pedidos', 'meusPedidos')}
            {titulo('Acompanhar pedido')}
            <Text style={styles.texto}>
              Pedido #{pedidoSelecionado?.numero}
            </Text>

            {etapas.map((etapa, index) => (
              <View key={etapa} style={styles.opcao}>
                <Text style={styles.opcaoTexto}>
                  {index <= etapaAtual ? '✅' : '◯'} {etapa}
                </Text>
              </View>
            ))}

            {etapaAtual < etapas.length - 1 &&
              botao('Simular próxima etapa', () => {
                const proxima = etapaAtual + 1;
                setEtapaAtual(proxima);

                if (pedidoSelecionado) {
                  const atualizado = {
                    ...pedidoSelecionado,
                    status: etapas[proxima],
                  };
                  setPedidoSelecionado(atualizado);
                  setPedidos((atual) =>
                    atual.map((pedido) =>
                      pedido.numero === atualizado.numero
                        ? atualizado
                        : pedido
                    )
                  );
                }
              })}
          </View>
        )}

        {tela === 'meusPedidos' && (
          <View>
            {voltar()}
            {titulo('Meus pedidos')}

            {pedidos.length === 0 ? (
              <Text style={styles.texto}>
                Você ainda não fez pedidos.
              </Text>
            ) : (
              pedidos.map((pedido) => (
                <View key={pedido.numero} style={styles.produto}>
                  <View style={styles.produtoInfo}>
                    <Text style={styles.produtoNome}>
                      Pedido #{pedido.numero}
                    </Text>
                    <Text style={styles.texto}>{pedido.data}</Text>
                    <Text style={styles.texto}>
                      {pedido.itens.map((item) => item.nome).join(', ')}
                    </Text>
                    <Text style={styles.preco}>
                      {dinheiro(pedido.total)}
                    </Text>
                    <Text style={styles.pequeno}>
                      Status: {pedido.status}
                    </Text>

                    {botao('Acompanhar', () => {
                      setPedidoSelecionado(pedido);
                      const indice = etapas.indexOf(pedido.status);
                      setEtapaAtual(indice >= 0 ? indice : 0);
                      setTela('rastreamento');
                    })}

                    {botao('Repetir pedido', () => {
                      setPedidoSelecionado(pedido);
                      setCarrinho([...pedido.itens]);
                      setEndereco(pedido.endereco.split(', ')[0] ?? '');
                      setNumero(pedido.endereco.split(', ')[1] ?? '');
                      setBairro(pedido.endereco.split(', ')[2] ?? '');
                      setPagamento(pedido.pagamento);
                      setTela('repetirPedido');
                    })}
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {tela === 'repetirPedido' && (
          <View>
            {voltar('← Meus pedidos', 'meusPedidos')}
            {titulo('Repetir pedido')}

            <Text style={styles.texto}>
              Confira os produtos antes de continuar.
            </Text>

            {carrinho.map((item, index) => (
              <View key={`${item.nome}-${index}`} style={styles.opcao}>
                <Text style={styles.opcaoTexto}>{item.nome}</Text>
                <Text style={styles.pequeno}>{item.detalhes}</Text>
                <Text style={styles.preco}>{dinheiro(item.preco)}</Text>
              </View>
            ))}

            <Text style={styles.subtitulo}>Endereço</Text>
            <TextInput
              style={styles.input}
              placeholder="Rua ou avenida"
              value={endereco}
              onChangeText={setEndereco}
            />
            <TextInput
              style={styles.input}
              placeholder="Número"
              value={numero}
              onChangeText={setNumero}
            />
            <TextInput
              style={styles.input}
              placeholder="Bairro"
              value={bairro}
              onChangeText={setBairro}
            />

            <Text style={styles.subtitulo}>Pagamento</Text>
            {['Pix', 'Cartão de crédito', 'Cartão de débito', 'Dinheiro'].map(
              (item) =>
                opcao(
                  item,
                  pagamento === item,
                  () => setPagamento(item)
                )
            )}

            <Text style={styles.titulo}>
              Total: {dinheiro(total)}
            </Text>

            {botao('Confirmar novamente', () => {
              if (!endereco.trim() || !numero.trim() || !bairro.trim()) {
                setMensagem('Confira o endereço de entrega.');
                return;
              }
              setMensagem('');
              setTela('pagamento');
            })}
          </View>
        )}

        {tela === 'perfil' && (
          <View>
            {voltar()}
            {titulo('Meu perfil')}
            <Text style={styles.texto}>
              Nome: {nomeCliente || 'Cliente'}
            </Text>
            <Text style={styles.texto}>E-mail: {email || 'Não informado'}</Text>
            <Text style={styles.texto}>Telefone: {telefone || 'Não informado'}</Text>
            <Text style={styles.preco}>MB Pontos: {pontos}</Text>

            {botao('Editar dados', () => setTela('editarPerfil'))}
            {botao('Meus pedidos', () => setTela('meusPedidos'))}
            {botao('MB Pontos', () => setTela('pontos'))}
            {botao('Painel administrativo', () => setTela('admin'))}
            {botao('Sair', () => setTela('inicio'))}
          </View>
        )}

        {tela === 'editarPerfil' && (
          <View>
            {voltar('← Perfil', 'perfil')}
            {titulo('Editar perfil')}

            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={nomeCliente}
              onChangeText={setNomeCliente}
            />
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Telefone"
              value={telefone}
              onChangeText={setTelefone}
            />

            {botao('Salvar alterações', () => {
              setMensagem('Dados atualizados nesta demonstração.');
              setTela('perfil');
            })}
          </View>
        )}

        {tela === 'pontos' && (
          <View>
            {voltar()}
            {titulo('Programa MB Pontos')}

            <View style={styles.resumo}>
              <Text style={styles.texto}>Seu saldo</Text>
              <Text style={styles.emojiGrande}>⭐ {pontos}</Text>
              <Text style={styles.texto}>
                Até R$ 30: +1 ponto
              </Text>
              <Text style={styles.texto}>
                De R$ 30,01 a R$ 60: +2 pontos
              </Text>
              <Text style={styles.texto}>
                De R$ 60,01 a R$ 90: +3 pontos
              </Text>
              <Text style={styles.texto}>
                Acima de R$ 90: +5 pontos
              </Text>
            </View>

            <Text style={styles.subtitulo}>Recompensas</Text>
            <Text style={styles.texto}>
              • 50 pontos: entrega grátis.
            </Text>
            <Text style={styles.texto}>
              • 100 pontos: até 50% de desconto no pedido.
            </Text>
            <Text style={styles.texto}>
              • 10 pontos: 10% de desconto.
            </Text>
            <Text style={styles.texto}>
              • 30 pontos: 20% de desconto.
            </Text>
            <Text style={styles.texto}>
              • 60 pontos: 30% de desconto.
            </Text>
            <Text style={styles.pequeno}>
              O desconto deve ser escolhido antes de confirmar a compra.
              O uso de pontos na entrega não acumula desconto no pedido.
            </Text>

            <Text style={styles.subtitulo}>Histórico de pontos</Text>
            {historicoPontos.length === 0 ? (
              <Text style={styles.texto}>
                Nenhuma movimentação ainda.
              </Text>
            ) : (
              historicoPontos.map((item, index) => (
                <Text key={`${item}-${index}`} style={styles.texto}>
                  • {item}
                </Text>
              ))
            )}

            {botao('Voltar ao cardápio', () => setTela('cardapio'))}
          </View>
        )}

        {tela === 'admin' && (
          <View>
            {voltar('← Perfil', 'perfil')}
            {titulo('Painel administrativo')}

            <ScrollView horizontal>
              {['Dashboard', 'Clientes', 'Estoque'].map((aba) => (
                <Pressable
                  key={aba}
                  style={[
                    styles.filtro,
                    adminAba === aba && styles.filtroAtivo,
                  ]}
                  onPress={() => setAdminAba(aba)}
                >
                  <Text
                    style={[
                      styles.filtroTexto,
                      adminAba === aba && styles.filtroTextoAtivo,
                    ]}
                  >
                    {aba}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {adminAba === 'Dashboard' && (
              <View>
                <View style={styles.resumo}>
                  <Text style={styles.subtitulo}>Resumo</Text>
                  <Text style={styles.texto}>
                    Pedidos registrados: {pedidos.length}
                  </Text>
                  <Text style={styles.texto}>
                    Faturamento registrado: {dinheiro(
                      pedidos.reduce((soma, p) => soma + p.total, 0)
                    )}
                  </Text>
                  <Text style={styles.texto}>
                    Clientes cadastrados nesta sessão: {nomeCliente ? 1 : 0}
                  </Text>
                  <Text style={styles.texto}>
                    Produtos no cardápio: {produtos.length}
                  </Text>
                  <Text style={styles.texto}>
                    Loja: aberta (demonstração)
                  </Text>
                  <Text style={styles.texto}>
                    Entregas: ativas (demonstração)
                  </Text>
                </View>
              </View>
            )}

            {adminAba === 'Clientes' && (
              <View>
                {titulo('Clientes')}
                <View style={styles.produto}>
                  <View style={styles.produtoInfo}>
                    <Text style={styles.produtoNome}>
                      {nomeCliente || 'Cliente demonstrativo'}
                    </Text>
                    <Text style={styles.texto}>
                      E-mail: {email || 'Não informado'}
                    </Text>
                    <Text style={styles.texto}>
                      Telefone: {telefone || 'Não informado'}
                    </Text>
                    <Text style={styles.texto}>
                      Pedidos: {pedidos.length}
                    </Text>
                    <Text style={styles.texto}>
                      MB Pontos: {pontos}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {adminAba === 'Estoque' && (
              <View>
                {titulo('Controle de estoque')}
                <Text style={styles.texto}>
                  Exemplo demonstrativo de estoque:
                </Text>

                {[
                  { nome: 'Açaí', quantidade: 80 },
                  { nome: 'Granola', quantidade: 45 },
                  { nome: 'Frutas', quantidade: 20 },
                  { nome: 'Potes', quantidade: 10 },
                ].map((item) => (
                  <View key={item.nome} style={styles.resumo}>
                    <Text style={styles.produtoNome}>{item.nome}</Text>
                    <Text style={styles.texto}>
                      Estoque: {item.quantidade}%
                    </Text>
                    <View style={styles.barraFundo}>
                      <View
                        style={[
                          styles.barra,
                          { width: `${item.quantidade}%` },
                        ]}
                      />
                    </View>
                    {item.quantidade <= 20 && (
                      <Text style={styles.alerta}>
                        Estoque baixo: verificar reposição.
                      </Text>
                    )}
                  </View>
                ))}

                <Text style={styles.subtitulo}>
                  Histórico de movimentação
                </Text>
                <Text style={styles.texto}>
                  Os dados acima são exemplos e não estão conectados a
                  um estoque real.
                </Text>
              </View>
            )}

            <Text style={styles.pequeno}>
              API Laravel: integração HTTP/JSON ainda necessária.
              Este painel funciona apenas como demonstração local.
            </Text>
          </View>
        )}

        {tela === 'sorveteMaracuja' && (
          <View>
            {voltar()}
            {titulo('Sorvete de maracujá')}
            <Text style={styles.texto}>
              Sorvete com sabor de maracujá. Consulte a loja para
              confirmar ingredientes e possíveis alergênicos.
            </Text>
            {botao('Adicionar ao carrinho', () =>
              adicionarProdutoSimples(
                'Sorvete de maracujá',
                10,
                'Sorvete de maracujá'
              )
            )}
          </View>
        )}

        {tela === 'granola' && (
          <View>
            {voltar()}
            {titulo('Granola artesanal')}
            <Text style={styles.texto}>
              Granola crocante para acompanhar seu açaí.
            </Text>
            {botao('Adicionar ao carrinho', () =>
              adicionarProdutoSimples(
                'Granola artesanal',
                8,
                'Em embalagem separada'
              )
            )}
          </View>
        )}
      </ScrollView>

      <View style={styles.rodape}>
        <Pressable onPress={() => setTela('cardapio')}>
          <Text style={styles.link}>Início</Text>
        </Pressable>
        <Pressable onPress={() => setTela('meusPedidos')}>
          <Text style={styles.link}>Pedidos</Text>
        </Pressable>
        <Pressable onPress={() => setTela('pontos')}>
          <Text style={styles.link}>Pontos</Text>
        </Pressable>
        <Pressable onPress={() => setTela('carrinho')}>
          <Text style={styles.link}>Carrinho ({carrinho.length})</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  cabecalho: {
    backgroundColor: CLARO,
    paddingTop: 48,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D8C2E8',
  },
  logo: {
    color: ROXO,
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  menuTopo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
  },
  conteudo: {
    padding: 18,
    paddingBottom: 30,
  },
  centralizado: {
    alignItems: 'center',
    paddingVertical: 35,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: ROXO,
    marginBottom: 14,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ROXO,
    marginTop: 18,
    marginBottom: 10,
  },
  texto: {
    color: '#333333',
    fontSize: 15,
    marginBottom: 8,
    lineHeight: 22,
  },
  pequeno: {
    color: '#666666',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 5,
  },
  emoji: {
    fontSize: 36,
    marginRight: 12,
  },
  emojiGrande: {
    fontSize: 60,
    marginBottom: 12,
  },
  produto: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
  },
  produtoInfo: {
    flex: 1,
  },
  produtoNome: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 6,
  },
  preco: {
    fontSize: 17,
    color: ROXO,
    fontWeight: 'bold',
    marginVertical: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginVertical: 7,
    backgroundColor: '#FFFFFF',
  },
  botao: {
    backgroundColor: ROXO,
    padding: 13,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  botaoTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  voltar: {
    marginBottom: 18,
    paddingVertical: 5,
  },
  textoRoxo: {
    color: ROXO,
    fontWeight: 'bold',
    fontSize: 15,
    marginVertical: 7,
  },
  link: {
    color: ROXO,
    fontWeight: 'bold',
    fontSize: 14,
    paddingHorizontal: 4,
    paddingVertical: 5,
  },
  filtro: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: ROXO,
    borderRadius: 20,
    marginRight: 8,
    marginVertical: 10,
  },
  filtroAtivo: {
    backgroundColor: ROXO,
  },
  filtroTexto: {
    color: ROXO,
    fontWeight: 'bold',
  },
  filtroTextoAtivo: {
    color: '#FFFFFF',
  },
  opcao: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 12,
    marginVertical: 5,
  },
  opcaoAtiva: {
    borderColor: ROXO,
    backgroundColor: CLARO,
  },
  opcaoTexto: {
    color: '#333333',
    fontSize: 15,
  },
  resumo: {
    backgroundColor: CLARO,
    padding: 14,
    borderRadius: 10,
    marginVertical: 10,
  },
  mensagem: {
    color: ROXO,
    backgroundColor: CLARO,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  barraFundo: {
    height: 10,
    backgroundColor: '#DDDDDD',
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 8,
  },
  barra: {
    height: 10,
    backgroundColor: ROXO,
    borderRadius: 5,
  },
  alerta: {
    color: '#B00020',
    fontWeight: 'bold',
    marginTop: 5,
  },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#DDDDDD',
    backgroundColor: '#FFFFFF',
  },
});
