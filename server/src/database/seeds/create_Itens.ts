import Knex from 'knex'
export async function seed(knex: Knex){
    await knex('itens').insert([
        {title:"Lâmpadas", image:'lampadas.svg'},
        {title:"Pilhas e Baterias", image:'baterias.svg'},
        {title:"Papéis e Eletrônicos", image:'eletronicos.svg'},
        {title:"Resíduos Orgânicos", image:'organicos.svg'},
        {title:"Óleo de cozinha", image:'oleo.svg'},
        {title:"Papeis e papelão",image:'papeis-papelao.svg'}
    ])
}