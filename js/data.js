var Duck = window.Duck || {};
window.Duck = Duck;

Duck.Data = {
    discord: "discord.gg/D9P5E9BwJj",
    anniversary: "Já se fazem 3 anos!",

    commands: [
        ["!build", "Entra/sai do modo de construção"],
        ["!loja", "Itens cosméticos (NADA P2W!)"],
        ["!conquistas", "Suas conquistas"]
    ],

    spotlight: {
        title: "Comandos úteis",
        badge: "DICA",
        commands: [
            ["!duelo", "<pessoa> [duckpoints]", "Desafie alguém para um duelo. Apostar duckpoints é opcional."],
            ["!tpa", "<pessoa>", "Peça para se teleportar até a pessoa."]
        ]
    },

    notice: {
        badge: "OBRIGATÓRIO",
        title: "Coleção de mapas",
        text: "Nossos mapas vivem em coleções diferentes por otimização. Escaneie e assine a coleção: é **NECESSÁRIO** para entrar nos mapas mais complexos e diferentes votados pelos players.",
        url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3753560669",
        qr: [
            "111111100100001000111111001111111",
            "100000101101101110001000001000001",
            "101110100111001000101111001011101",
            "101110101101010111000011101011101",
            "101110100010101000111001101011101",
            "100000101010011110000100001000001",
            "111111101010101010101010101111111",
            "000000000000100110001100000000000",
            "111110111110110111010011110101010",
            "110111010100001000011101001000111",
            "110100110101100110001100011011010",
            "101010001111000010100111010010100",
            "011110110101010111010011110111000",
            "111101011110101000111111001000011",
            "000111101100011110100000011010010",
            "011010001100100000011101110100100",
            "001000100110110111000010110110010",
            "001100011000001001111101011001011",
            "101111110001111110101110110001010",
            "010101011111000110011111010010100",
            "101111101111010011010011110110010",
            "100111000100111001110101101001011",
            "100010110110000100001110011001010",
            "101111000110101110110100101101100",
            "100000100010100101001011111111001",
            "000000001100000010011101100010101",
            "111111101101100111101011101011010",
            "100000100001000100001101100011110",
            "101110101011000001100010111111000",
            "101110101110110011111000110111100",
            "101110101100011111000101101000110",
            "100000101100110010001111001001100",
            "111111101110101011110011110000010"
        ]
    },

    update: {
        version: "v4.0.0",
        title: "Tra-La-Laaaaaaaaaaaaaaaaaa!",
        sections: [
            { title: "Novidades", blocks: [
                { text: "Muito mais conteúdo, desde conquistas, missões, killeffects, killeffects que se pegam com conquistas, mais uma conquista secreta, e o que mais eu consegui fazer no final da tarde de ontem e a tarde de hoje e a madrugada de segunda!" }
            ]},
            { title: "Conquistas", blocks: [
                { items: ["50 conquistas novas!"] },
                { text: "Kills totais, armas do HL2 (crossbow, RPG, .357, SLAM, SMG, shotgun...), sequências, multikills (Double, Triple e Mega Kill), kill de longe, encerrar a sequência dos outros, nêmesis, mortes por queda, tempo de jogo, loja, caixas, duelos, medalhas e mais." },
                { items: [
                    "Algumas são secretas.",
                    "Todas dá pra pegar jogando normal.",
                    "Os DuckPoints de cada conquista seguem a raridade, como sempre, mas ajustei pra umas conquistas dar mais duckpoints."
                ]}
            ]},
            { title: "Duck's Store: Kill Effects", blocks: [
                { items: [
                    "20 kill effects novos, e vários são bem mais elaborados: o corpo é fatiado, escorre como areia, vira holograma, cai por um portal infinito, é esmagado por uma cruz de pedra gigante e muito mais.",
                    "19 kill effects agora são destravados por conquistas. Eles saem da loja, não custam DuckPoints e ficam seus de graça quando você desbloqueia a conquista. **Quem já tinha comprado algum continua com ele.**",
                    "Exemplos: o do pé de cabra gigante pra quem mata 100 com o crowbar, Cruz de Pedra pra quem faz 100 kills seguidas, Poeira pra quem chega em 5.000 kills.",
                    "Toque de Midas agora fica realmente dourado, e enquanto equipado dá +25% de DuckPoints nos seus ganhos.",
                    "O Raio Encolhedor ganhou uma arminha alien."
                ]}
            ]},
            { title: "Doadores", blocks: [
                { items: [
                    "Todo doador recebeu 10.000 DuckPoints (uma vez só, com popup) como agradecimento.",
                    "Doadores agora ganham 1.5x de DuckPoints nos ganhos normais (conquistas, killstreaks, medalhas, minigames). Apostas e caixas ficam de fora.",
                    "Se você é doador e usa o Toque de Midas, os bônus somam.",
                    "**Staffs que eram doadores e não conseguiam comprar sweps de doadores (atual só um, mas vai ter mais sweps no futuro) agora conseguem efetuar a compra.**"
                ]}
            ]},
            { title: "Bounties", blocks: [
                { items: [
                    "Sistema de bounties para colocar recompensas na cabeça dos outros, cooldown de 30 minutos por bounty.",
                    "Apenas uma recompensa pode ser colocada por pessoa, e ela tem um limite de até 5 milhões."
                ]}
            ]},
            { title: "Missões", blocks: [
                { text: "Sistema de missões simples para focar no sandbox alheio, apenas uma prova de conceito, esperamos mais sugestões! Criei uma tag de \"missão\" no canal de sugestões." }
            ]},
            { title: "Loading screen", blocks: [
                { items: ["Novas variações feitas, e musiquinhas."] }
            ]},
            { title: "Bug fixes", blocks: [
                { items: [
                    "Pesca voltou a funcionar, mas a água que tu for usar para pescar precisa ter uma profundidade.",
                    "Alguns sons de efeitos ficavam tocando no mapa depois que o efeito acabava, isso foi consertado."
                ]}
            ]}
        ]
    },

    screenshots: [
        "204EAC1.webp", "bfxx.webp", "bom.webp", "Captura_de_tela_2026-09-05_023503.webp",
        "cxzcx.webp", "f5tfwp1.webp", "feli.webp", "fgxbcx.webp", "image.webp", "lug.webp",
        "popo.webp", "sadasda.webp", "sdfds.webp", "t3.webp", "tt.webp", "t.webp",
        "VWkld8X.webp", "xcvxc.webp", "xczxcz.webp", "zcxzczx.webp",
        "novo-01.webp", "novo-02.webp", "novo-03.webp", "novo-04.webp", "novo-05.webp",
        "novo-06.webp", "novo-07.webp", "novo-08.webp", "novo-09.webp", "novo-10.webp",
        "novo-11.webp", "novo-12.webp", "novo-13.webp", "novo-14.webp",
        "bigcity.webp", "scary.webp", "scpdk.webp"
    ],

    rules: [
        { title: "Preconceito", items: [
            ["1.1", "Qualquer tipo de preconceito, seja direta ou indiretamente, não é tolerado e resultará em banimento permanente caso comprovado."]
        ]},
        { title: "Lag no Servidor / Crash", items: [
            ["2.1", "Qualquer tentativa proposital de causar lag ou derrubar o servidor é proibida e pode resultar em banimento permanente ou temporário."]
        ]},
        { title: "Wiremod & Dupes", items: [
            ["3.1", "Dupes ou sistemas wiremod que eliminem um jogador no spawn sem chance de reação (spawnkill) são proibidos."],
            ["3.2", "Sistemas wiremod que ceguem (blinder) ou emitam áudio em volume extremo são proibidos."],
            ["3.3", "Turrets automáticas não podem ser spawnadas perto do spawn."],
            ["3.4", "Todo sistema de combate deve permitir contra-ataque, direto ou indireto. Hitkill ou dano desproporcional são proibidos."],
            ["3.5", "Nenhum sistema pode impedir um jogador de realizar suas atividades comuns (construir, se locomover, etc)."],
            ["3.6", "Sistemas que deem vantagem desproporcional em combate (ex: cura automática) são proibidos."]
        ]},
        { title: "Denúncias", items: [
            ["4.1", "Denúncias falsas via @ ou sistema de Tickets do Discord são proibidas e podem resultar em mute temporário."]
        ]},
        { title: "Áudios / Soundboards", items: [
            ["5.1", "Proibido tocar áudios absurdamente altos de forma proposital. Punição vai de aviso a mute temporário."]
        ]},
        { title: "Toxicidade", items: [
            ["6.1", "Não atrapalhe de forma proposital e persistente a experiência de outros jogadores. Punição a critério do moderador."],
            ["6.2", "Isso inclui xingar, perseguir, impossibilitar de jogar, entre outros comportamentos."],
            ["6.3", "Xingar constantemente ou dizer coisas como \"se mata\" para outros jogadores não é tolerado. Este servidor é seguro para todos."],
            ["", "Xingamentos entre amigos são permitidos, desde que ambos concordem e não seja no chat geral."]
        ]},
        { title: "Senso Comum", items: [
            ["7.1", "Não seja estúpido de propósito. Comportamento claramente idiota e proposital resulta em banimento permanente."],
            ["7.2", "O fato de algo não estar nas regras não significa que é permitido."]
        ]},
        { title: "Sistema Builder", items: [
            ["8.1", "Abusar do modo builder para invadir bases, matar ou obter vantagem em PvP é proibido, sujeito a banimento ou blacklist permanente do sistema."]
        ]},
        { title: "Outfitter / Wardrobe", items: [
            ["9.1", "Todo playermodel utilizado no sistema Outfitter/Wardrobe deve ser \"Safe-for-Work\" (SFW). É proibido o uso de playermodels extremamente sexualizados ou \"Not-Safe-For-Work\" (NSFW)."],
            ["9.2", "Playermodels \"Borderline NSFW\" NÃO são permitidos. Você será advertido para trocar de playermodel e, se recusar, pode ser banido do wardrobe ou do servidor."],
            ["9.3", "Nenhum playermodel deve apresentar conteúdo \"fetichista\"."]
        ]},
        { title: "Sistema de Facções", items: [
            ["10.1", "Nenhum ícone de facção deve ter conteúdo NSFW (inclui fetichista ou super sexualizado), sob pena de remoção da facção e banimento permanente do criador."],
            ["10.2", "Não são permitidas facções que reflitam grupos reais; nomes que fazem referência são permitidos, mas ícones de grupos reais não (ex: swastika ou bandeira da Waffen-SS)."]
        ]}
    ],

    footer: "Enrolar em casos para evitar punição resulta em banimento permanente sem revogação. Toda punição pode ser discutida com a gerência."
};
