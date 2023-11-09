import React from 'react'

export default function Tutorial() {
  return (
    <div className='fs-4 bg-body-tertiary p-3 rounded-3 mb-3'>
        <h1>Tutorial</h1>
        <p>You have 6 chances to deduce the title of the map based on the hints provided! Each incorrect guess unlocks the next hint.</p>
        <p>You just need the title of the map, you don't need to remember the exact difficulty name.</p>
        <p>You can search the map title database by the title or difficulty name of the map</p>
        <p>See if you can guess the map without hearing the song!</p>
        <p>*Most* maps featured in this game have at least 100k plays.</p>
        <p>New map every day at 7:27pm PDT</p>
        <hr/>
        <h1>Submission</h1>
        <p>I want the daily maps to be community-driven, otherwise my bias for osu! maps would take over osudle!. So please submit maps you would like to see in osudle!!</p>
        <p>You must sign in with your osu! account in order use the submission feature.</p>
    </div>
  )
}