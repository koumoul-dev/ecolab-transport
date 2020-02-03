import React, { useState } from 'react'
import logoAdeme from './ademe.jpg'
import logoEcolab from './ecolab.png'
import modes from './modes.yaml'

const shadowStyle =
		'box-shadow: 0px 2px 4px -1px rgba(41, 117, 209, 0.2), 0px 4px 5px 0px rgba(41, 117, 209, 0.14), 0px 1px 10px 0px rgba(41, 117, 209, 0.12)',
	blue = '#7b9fc4'

export default () => {
	const [distance, setDistance] = useState(10)
	const limiteUrbain = +modes['limite trajet urbain'].split('km')[0],
		modesCommuns = modes['les deux'],
		modesPertinents =
			distance > limiteUrbain
				? [...modes['extra-urbains'], ...modesCommuns]
				: [...modes['urbains'], ...modesCommuns],
		dansIntervalle = (intervalle, unité) => {
			const de = +intervalle.split('-')[0],
				àRaw = intervalle.split('-')[1].split(' ' + unité)[0],
				à = àRaw === '∞' ? Infinity : +àRaw

			return distance > de && distance <= à
		},
		valeur = m => {
			const parPassager = m['gCO2e/km/passager'],
				parVéhicule = m['gCO2e/km/véhicule']

			if (m.titre === 'TER') {
			}
			if (['bus', 'tram ou trolleybus', 'ferry', 'TER'].includes(m.titre)) {
				/* Once the inhabitants and other variables are known :
				return Object.entries(parPassager).find(
					([intervalle]) => dansIntervalle
				)[1]

				*/
				const valeurs = Object.values(parPassager)
				return valeurs.reduce((memo, next) => memo + next, 0) / valeurs.length
			}
			if (m.titre === 'avion') {
				let chiffresPertinents = Object.values(parPassager)
					.map(intervalles =>
						Object.entries(intervalles).find(([intervalle]) =>
							dansIntervalle(intervalle, 'km')
						)
					)
					.filter(Boolean)
				return (
					chiffresPertinents.reduce((memo, [, next]) => memo + next, 0) /
					chiffresPertinents.length
				)
			}
			return parPassager != null ? parPassager : parVéhicule
		},
		classement = modesPertinents.sort((m1, m2) => valeur(m1) - valeur(m2)),
		empreinteMaximum = valeur(classement[classement.length - 1]),
		valeurAffichée = mode => {
			const résultat = (valeur(mode) / 1000) * distance
			return résultat === 0
				? 0
				: résultat < 10
				? résultat.toFixed(1)
				: Math.round(résultat)
		}

	return (
		<div
			css={`
				margin: 1rem;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				align-items: center;

				ul {
					padding: 0;
				}
			`}
		>
			<header>
				<div
					css={`
						display: flex;
						justify-content: center;
						align-items: center;
					`}
				>
					<img css="height: 6vh" src={logoAdeme} />
					<img css="height: 5vh" src={logoEcolab} />
				</div>
				<h1>Mon déplacement est-il écolo ?</h1>
			</header>
			<section
				css={`
					font-size: 150%;
					margin: 1rem 0 0rem;

					max-width: 30rem;
					input {
						border-radius: 0.3rem;
						border: 2px solid ${blue};
						width: 6rem;
						margin: 0 0.5rem 0 1rem;
						padding: 0 0.3rem;
						text-align: right;
						font-size: inherit;
						${shadowStyle}
					}
					input[type='number']::-webkit-inner-spin-button,
					input[type='number']::-webkit-outer-spin-button {
						-webkit-appearance: none;
					}

					input[type='number'] {
						-moz-appearance: textfield;
					}
				`}
			>
				<label>
					Quelle distance ?
					<input
						type="number"
						max="40000"
						min="0"
						value={distance}
						onChange={({ target: { value } }) => setDistance(value)}
					/>
					km
				</label>
				<div
					css={`
						ul {
							font-size: 75%;
						}
						li {
							display: inline-block;
							margin: 0.1rem 0.4rem;
						}
						li a {
							font-size: 80%;
						}
					`}
				>
					<ul>
						{modes.suggestions.map(({ titre, km }) => (
							<li key={titre}>
								<a
									href="#"
									onClick={() => setDistance(km)}
									css={distance === km ? `background: yellow;` : ``}
								>
									{titre}
								</a>
							</li>
						))}
					</ul>
				</div>
			</section>
			<section
				css={`
					h2 {
						margin-bottom: 0.1rem;
					}
					small {
						margin-bottom: 3rem;
						font-style: italic;
					}
					ul {
						margin-left: 2rem;
					}
				`}
			>
				<h2>Votre empreinte sur le climat</h2>
				<small>En kilos de gaz à effet de serre (kg CO2e) par personne</small>
				<ul>
					{classement.map(mode => (
						<li key={mode.titre} css="margin: .6rem 0; list-style-type: none">
							<div>
								<span>{capitalizeFirst(mode.titre)}</span>
							</div>
							<div
								css={`
									display: flex;
									align-items: center;
								`}
							>
								<span css="font-size: 100%; margin-left: -2rem; margin-right: .6rem">
									{mode.icônes}
								</span>
								<span
									css={`
										display: inline-block;
										background: purple;
										margin-top: 0.2rem;
										margin-right: 0.8rem;
										height: 1rem;
										padding-left: 0.1rem;
										border-radius: 0.4rem;
										width: ${(valeur(mode) / empreinteMaximum) * 100 * 0.9}%;
										color: white;
										${shadowStyle}
									`}
								></span>
								<span css="color: purple; font-weight: 600; vertical-align: baseline;">
									{valeurAffichée(mode)}
								</span>
							</div>
						</li>
					))}
				</ul>
			</section>
		</div>
	)
}
const capitalizeFirst = text =>
	text[0].toUpperCase() + text.slice(1, text.length)
