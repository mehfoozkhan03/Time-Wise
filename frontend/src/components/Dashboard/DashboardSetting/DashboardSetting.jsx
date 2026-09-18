import { useEffect, useState } from "react";
import "./DashboardSetting.css";
// import { aiSettingsService } from "../../../services/aiSettingsService";

export const DashboardSetting = () => {
  const [settings, setSettings] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDisableChoice, setShowDisableChoice] = useState(false);
  const [mode, setMode] = useState("disabled_for_everyone");
  const [selectedIDs, setSelectedIDs] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [settingsResponse, employeesResponse] = await Promise.all([
          aiSettingsService.get(),
          aiSettingsService.getEmployees(),
        ]);
        setSettings(settingsResponse.data.settings);
        setEmployees(employeesResponse.data.employees);
        setSelectedIDs(settingsResponse.data.settings.disabledUserIDs || []);
      } catch (error) {
        setMessage(
          error.response?.data?.message || "Unable to load WiseBot settings.",
        );
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const save = async (accessMode, disabledUserIDs = []) => {
    setIsSaving(true);
    setMessage("");
    try {
      const { data } = await aiSettingsService.update({
        accessMode,
        disabledUserIDs,
      });
      setSettings(data.settings);
      setSelectedIDs(data.settings.disabledUserIDs || []);
      setShowDisableChoice(false);
      setMessage("WiseBot access updated.");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to save WiseBot access.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const toggleEmployee = (id) =>
    setSelectedIDs((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );

  const isEnabled = settings?.accessMode === "enabled";

  return (
    <div className="dashboardSetting-container">
      <div className="dashboardSetting-header">
        <h3>WiseBot Access</h3>
        <span>Choose who can use WiseBot in your organisation.</span>
      </div>
      <section className="dashboard-ai-setting simple-ai-setting">
        {isLoading ? (
          <p className="ai-settings-message">Loading WiseBot access...</p>
        ) : (
          <>
            <div className="dashboard-ai-setting-header">
              <div>
                <h3>WiseBot</h3>
                <p>
                  {isEnabled
                    ? "Available to everyone."
                    : settings?.accessMode === "disabled_for_everyone"
                      ? "Disabled for the full organisation."
                      : "Disabled for selected employees."}
                </p>
              </div>
              <label className="ai-toggle">
                <input
                  type="checkbox"
                  checked={isEnabled}
                  disabled={isSaving}
                  onChange={(event) =>
                    event.target.checked
                      ? save("enabled")
                      : setShowDisableChoice(true)
                  }
                />
                <span>{isEnabled ? "Enabled" : "Disabled"}</span>
              </label>
            </div>
            {showDisableChoice && (
              <div className="ai-disable-choice">
                <h4>Who should lose WiseBot access?</h4>
                <label>
                  <input
                    type="radio"
                    name="disable-mode"
                    checked={mode === "disabled_for_everyone"}
                    onChange={() => setMode("disabled_for_everyone")}
                  />{" "}
                  Full organisation
                </label>
                <label>
                  <input
                    type="radio"
                    name="disable-mode"
                    checked={mode === "disabled_for_selected"}
                    onChange={() => setMode("disabled_for_selected")}
                  />{" "}
                  Selected employees
                </label>
                {mode === "disabled_for_selected" && (
                  <div className="ai-employee-list">
                    {employees.map((employee) => (
                      <label key={employee._id}>
                        <input
                          type="checkbox"
                          checked={selectedIDs.includes(employee._id)}
                          onChange={() => toggleEmployee(employee._id)}
                        />
                        <span>
                          {employee.firstName} {employee.lastName}
                          <small>{employee.email}</small>
                        </span>
                      </label>
                    ))}
                  </div>
                )}
                <div className="ai-choice-actions">
                  <button
                    type="button"
                    onClick={() => setShowDisableChoice(false)}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      save(
                        mode,
                        mode === "disabled_for_selected" ? selectedIDs : [],
                      )
                    }
                    disabled={
                      isSaving ||
                      (mode === "disabled_for_selected" &&
                        selectedIDs.length === 0)
                    }
                  >
                    {isSaving ? "Saving..." : "Confirm disable"}
                  </button>
                </div>
              </div>
            )}
            {message && <p className="ai-settings-message">{message}</p>}
          </>
        )}
      </section>
    </div>
  );
};
