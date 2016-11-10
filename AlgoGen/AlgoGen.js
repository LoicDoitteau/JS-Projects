var DNA = function(target, mutationRate)
{
	var genesLentgh = target.length;
	var genes = [];
	targetGenes = target.split('');
	var alphabet = "azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN 0123456789+-*/?,;.:!§".split('');
	for (var i = 0; i < genesLentgh; i++) 
	{
		genes[i] = alphabet[Math.floor((Math.random() * alphabet.length))];
	}
	return {
		getGene : function(index)
		{
			return JSON.parse(JSON.stringify(genes))[index];
		},
		setGene : function(index, gene)
		{
			if(index >= 0 && index < genesLentgh)
				genes[index] = gene;
		},
		getGenes : function()
		{
			return JSON.parse(JSON.stringify(genes));
		},
		getFitness : function()
		{
			var score = 1;
			for(var i = 0; i < genesLentgh; i++)
			{
				if(genes[i] == targetGenes[i])
					score++;
			}
			return score;
		},
		mutate : function()
		{
			for(var i = 0; i < genesLentgh; i++)
			{
				var r = Math.random();
				if(r <= mutationRate)
					genes[i] = alphabet[Math.floor((Math.random() * alphabet.length))];
			}
		},
		getCrossover : function(otherDNA)
		{
			var midPoint = Math.floor(Math.random() * genesLentgh);
			var child = DNA(target, mutationRate);
			for(var i = 0; i < genesLentgh; i++)
			{
				child.setGene(i, i < midPoint ? genes[i] : otherDNA.getGene(i)); 
			}
			return child;
		}
	};
};

var Evolution = function(population, mutationRate, target)
{
	var DNAs = [];
	var generation = 1;
	var wheelRanges = [];
	var sumFitnesses = 0;
	var bestDNA = null;
	var bestFitness = 0;
	for(var i = 0; i < population; i++)
	{
		DNAs[i] = DNA(target, mutationRate); 
	}
	var selection = function()
	{
		wheelRanges = [];
		sumFitnesses = 0;
		bestDNA = null;
		bestFitness = 0;
		for(var i = 0; i < population; i++)
		{
			var fitness = DNAs[i].getFitness();
			sumFitnesses += fitness;
			wheelRanges[i] = sumFitnesses

			if(fitness > bestFitness)
			{
				bestDNA = DNAs[i];
				bestFitness = fitness;
			}
		}
	};
	var reproduction = function()
	{
		var newDNAs = [];
		for(var i = 0; i < population; i++)
		{
			var p1 = Math.random() * sumFitnesses;
			var DNA1 = null;
			for(var j = 0; j < population; j++)
			{
				p1 -= DNAs[j].getFitness();
				if(p1 <= 0)
				{
					DNA1 = DNAs[j];
					break;
				}
			}
			if(DNA1 == null)
				DNA1 = DNAs[population -1];

			var p2 = Math.random() * sumFitnesses;
			var DNA2 = null;
			for(var j = 0; j < population; j++)
			{
				p2 -= DNAs[j].getFitness();
				if(p2 <= 0)
				{
					DNA2 = DNAs[j];
					break;
				}
			}
			if(DNA2 == null)
				DNA2 = DNAs[population -1];

			newDNAs[i] = DNA1.getCrossover(DNA2);
			newDNAs[i].mutate();
		}
		DNAs = newDNAs;
	};
	return {
		evolve : function()
		{
			selection();
			reproduction();
			generation++;
			document.getElementById("answer").innerHTML = (bestDNA.getGenes().join(''));
		},
		getPopulation()
		{
			return JSON.parse(JSON.stringify(DNAs))
		},
		getGeneration()
		{
			return generation;
		}
	};
};

function getUrlParams()
{	
	var parts = location.search.substring(1).split('&');
	var params = [];
	for (var i = 0; i < parts.length; i++)
	{
		var kv = parts[i].split('=');
		params[kv[0]] = kv[1];
	}
	return params;
}

var population = 150;
var generations = 3000
var mutationRate = 0.01;
var target = getUrlParams().value;
target = target == null ? "Hello world" : decodeURI(target);
var interval = 10;
var evolution = Evolution(population, mutationRate, target);
var ID = setInterval(function()
	{
		evolution.evolve();
		if(evolution.getGeneration() == generations)
			clearInterval(ID);
	}, interval);
