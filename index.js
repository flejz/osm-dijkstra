// Módulos auxiliares de Dijkstra e promise
const 
    Graph = require('node-dijkstra'),
    Promise = require('bluebird');

// Dicionários de dados
const 
    hospitals = require('./hospitalMap.json'),
    graphTime = require('./graphs/graph_time.json'),
    graphDistance = require('./graphs/graph_distance.json');

// Algoritmos de Dijkstra
const
    time =  new Graph(graphTime),
    distance = new Graph(graphDistance);

// Informa qual é o ponto de origem
let startPoint = 'pt9559';
let graphType = 'distance'; // Distance ou Time

Promise
    .all(
        hospitals.map(hospital => new Promise(resolve => {
            
            let path = (graphType === 'distance' ? distance : time).path(
                startPoint, 
                hospital.vertex.name, { 
                    cost: true 
                }
            )

            resolve(Object.assign(path, hospital))
        }))
    )
    .then(
        results => {
            let closestResult = results
                .filter(result => result.path !== null)
                .reduce((closer, current) => {
                    return closer.cost < current.cost ? closer : current;
                });

            console.log(closestResult.hospital.name);
            console.log(closestResult.vertex);
        }
    )
    .catch(console.exception);