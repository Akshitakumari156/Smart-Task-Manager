import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Users, X, Trash2 } from "lucide-react";

const TeamsSection = () => {
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTeam, setActiveTeam] = useState(null);

  const [newTeamName, setNewTeamName] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const token = localStorage.getItem("token");
  // Fetch employees connected to manager
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/getEmployee`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        console.log(data);
        setEmployees(data.employees || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEmployees();
  }, [token]);

  // Fetch teams of manager
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const managerId = JSON.parse(atob(token.split(".")[1]))._id;

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/${managerId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        setTeams(data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTeams();
  }, [token]);

  /* ================= CREATE TEAM ================= */

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/teams/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newTeamName,
          members: selectedEmployees
        })
      });

      const data = await res.json();

      if (data.success) {
        setTeams(prev => [...prev, data.team]);
        setShowCreateModal(false);
        setNewTeamName("");
        setSelectedEmployees([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= REMOVE MEMBER ================= */

  const handleRemoveMember = async (teamId, memberId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/teams/${teamId}/remove-member/${memberId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();
      if (data.team) {
        setTeams(prev =>
          prev.map(t => (t._id === teamId ? data.team : t))
        );
        setActiveTeam(data.team);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">Teams Dashboard</h1>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 rounded-lg"
        >
          <Plus size={18} /> Create Team
        </button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {teams.map(team => (
          <div
            key={team._id}
            onClick={() => setActiveTeam(team)}
            className="bg-[#1e293b] p-6 rounded-xl cursor-pointer"
          >
            <h2 className="text-xl font-semibold">{team.name}</h2>
            <div className="flex items-center gap-2 text-gray-400 mt-2">
              <Users size={16} />
              {team.members.length} Members
            </div>
          </div>
        ))}
      </div>

      {/* ================= CREATE TEAM MODAL ================= */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div className="fixed inset-0 bg-black/70 flex justify-center items-center">
            <motion.div className="bg-[#1e293b] p-6 rounded-xl w-full max-w-md">
              <button
                onClick={() => setShowCreateModal(false)}
                className="float-right"
              >
                <X />
              </button>

              <h2 className="text-2xl font-bold mb-4">Create Team</h2>

              <input
                value={newTeamName}
                onChange={e => setNewTeamName(e.target.value)}
                placeholder="Team Name"
                className="w-full p-2 rounded bg-[#0f172a] mb-4"
              />

              <h4 className="font-semibold mb-2">Select Employees</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {employees.map(emp => (
                  <label key={emp._id} className="flex gap-2">
                    <input
                      type="checkbox"
                      value={emp._id}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedEmployees(prev => [...prev, emp._id]);
                        } else {
                          setSelectedEmployees(prev =>
                            prev.filter(id => id !== emp._id)
                          );
                        }
                      }}
                    />
                    {emp.name} ({emp.email})
                  </label>
                ))}
              </div>

              <button
                onClick={handleCreateTeam}
                className="w-full mt-4 bg-purple-600 py-2 rounded-lg"
              >
                Create Team
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= TEAM DETAILS MODAL ================= */}
      <AnimatePresence>
        {activeTeam && (
          <motion.div className="fixed inset-0 bg-black/70 flex justify-center items-center">
            <motion.div className="bg-[#1e293b] p-6 rounded-xl w-full max-w-lg">
              <button
                onClick={() => setActiveTeam(null)}
                className="float-right"
              >
                <X />
              </button>

              <h2 className="text-2xl font-bold mb-4">
                {activeTeam.name}
              </h2>

              {activeTeam.members.map(member => (
                <div
                  key={member._id}
                  className="flex justify-between items-center bg-[#0f172a] p-2 rounded mb-2"
                >
                  <div>
                    <p>{member.name}</p>
                    <p className="text-sm text-gray-400">{member.email}</p>
                  </div>
                  <button
                    onClick={() =>
                      handleRemoveMember(activeTeam._id, member._id)
                    }
                    className="text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamsSection;
