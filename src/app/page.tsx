"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [statusOptions, setStatusOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
      const data = await res.json();
      setCharacters(data.results);
      setFilteredCharacters(data.results);

      const statuses = Array.from(new Set(data.results.map((character) => character.status)));
      const genders = Array.from(new Set(data.results.map((character) => character.gender)));

      setStatusOptions(["All", ...statuses]);
      setGenderOptions(["All", ...genders]);
    };

    fetchData();
  }, [page]);

  useEffect(() => {
    let filtered = characters;

    if (statusFilter !== "All") {
      filtered = filtered.filter((character) => character.status === statusFilter);
    }

    if (genderFilter !== "All") {
      filtered = filtered.filter((character) => character.gender === genderFilter);
    }

    setFilteredCharacters(filtered);
  }, [statusFilter, genderFilter, characters]);

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Rick and Morty Characters</h1>

        <div className="mb-4">
          <label htmlFor="status" className="mr-2">Status: </label>
          <select
              id="status"
              className="border rounded p-2 text-black"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map((status, index) => (
                <option key={index} value={status}>{status}</option>
            ))}
          </select>

          <label htmlFor="gender" className="ml-4 mr-2">Gender: </label>
          <select
              id="gender"
              className="border rounded p-2 text-black"
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
          >
            {genderOptions.map((gender, index) => (
                <option key={index} value={gender}>{gender}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredCharacters.map((character) => (
              <div
                  key={character.id}
                  className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <img
                    src={character.image}
                    alt={character.name}
                    className="w-32 h-32 rounded-full"
                />
                <div className="flex flex-col justify-between p-4 leading-normal">
                  <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {character.name}
                  </h5>
                  <p className="mb-1 flex items-center text-gray-700 dark:text-gray-400">
                <span
                    className={`inline-block w-3 h-3 rounded-full mr-2 ${
                        character.status === "Alive"
                            ? "bg-green-500"
                            : character.status === "Dead"
                                ? "bg-red-500"
                                : "bg-gray-500"
                    }`}
                ></span>
                    {character.status} - {character.species}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Last known location: {character.location.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    First seen in:{" "}
                    <span className="font-medium">
                  {character.episode && character.episode.length > 0 ? (
                      <EpisodeNamesFetcher episodeUrls={character.episode.slice(0, 1)} />
                  ) : (
                      "No episode data"
                  )}
                </span>
                  </p>
                </div>
              </div>
          ))}
        </div>

        <div className="flex justify-between mt-4">
          {page > 1 && (
              <button
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                  onClick={handlePrevPage}
              >
                Previous
              </button>
          )}
          <button
              className="bg-blue-500 text-white py-2 px-4 rounded"
              onClick={handleNextPage}
          >
            Next
          </button>
        </div>
      </div>
  );
}

function EpisodeNamesFetcher({ episodeUrls }) {
  const [episodeName, setEpisodeName] = useState("");

  useEffect(() => {
    const fetchEpisodeName = async () => {
      if (episodeUrls.length > 0) {
        try {
          const response = await fetch(episodeUrls[0]);
          const data = await response.json();
          setEpisodeName(data.name);
        } catch (error) {
          console.error("Error fetching episode:", error);
        }
      }
    };

    fetchEpisodeName();
  }, [episodeUrls]);

  return <span>{episodeName ? episodeName : "Loading episode..."}</span>;
}
