import { shadowStyle } from './styles'
import Covoitureurs from './Covoitureurs'
import Propulsion from './Propulsion'
import Value from './Value'
import Emoji from './Emoji'
import React from 'react'

export default ({
	mode,
	options,
	setOptions,
	distance,
	facteur,
	empreinteMaximum,
	setDetails
}) => (
	<>
		<div>
			<span onClick={() => setDetails(mode)}>
				{capitalizeFirst(mode.titre)}
			</span>

			{mode.titre.includes('voiture') && (
				<Covoitureurs
					voyageurs={options.voyageurs || mode.voyageurs}
					setVoyageurs={n => setOptions({ ...options, voyageurs: n })}
				/>
			)}
			{false && //Le choix de la propulsion TER est en test
				mode.titre.includes('TER') && (
					<Propulsion
						propulsion={options.propulsion}
						setPropulsion={propulsion => setOptions({ ...options, propulsion })}
					/>
				)}
		</div>
		<div
			css={`
				display: flex;
				align-items: center;
			`}
		>
			<span
				onClick={() => setDetails(mode)}
				css="font-size: 100%; width: 1.5rem; margin-left: -2rem; margin-right: .6rem"
			>
				<Emoji emoji={mode.icônes} />
			</span>
			<span
				onClick={() => setDetails(mode)}
				css={`
					display: inline-block;
					background: purple;
					margin-top: 0rem;
					margin-right: 0.8rem;
					height: 1.1rem;
					padding-left: 0.1rem;
					border-radius: 0.4rem;
					width: ${((distance * facteur(distance, mode, options)) /
						empreinteMaximum) *
						100 *
						0.9}%;
					color: white;
					${shadowStyle}
				`}
			></span>
			<Value {...{ mode, facteur, options, distance }} />
		</div>
	</>
)
export const capitalizeFirst = text =>
	text[0].toUpperCase() + text.slice(1, text.length)
