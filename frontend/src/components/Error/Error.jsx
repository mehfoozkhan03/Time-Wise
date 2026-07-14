import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Parallax from "parallax-js";

import "./Error.css";

export function Error() {
  const sceneRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let parallaxInstance = null;
    if (sceneRef.current) {
      parallaxInstance = new Parallax(sceneRef.current, {
        hoverOnly: false,
      });
    }
    return () => {
      if (parallaxInstance) parallaxInstance.destroy();
    };
  }, []);

  return (
    <section className="nf_wrapper">
      <div className="nf_container">
        {/* ── Parallax Scene ── */}
        <div id="scene" className="nf_scene" ref={sceneRef}>
          <div className="nf_circle" data-depth="1.2" />

          <div className="nf_one" data-depth="0.9">
            <div className="nf_content">
              <span className="nf_piece" />
              <span className="nf_piece" />
              <span className="nf_piece" />
            </div>
          </div>

          <div className="nf_two" data-depth="0.60">
            <div className="nf_content">
              <span className="nf_piece" />
              <span className="nf_piece" />
              <span className="nf_piece" />
            </div>
          </div>

          <div className="nf_three" data-depth="0.40">
            <div className="nf_content">
              <span className="nf_piece" />
              <span className="nf_piece" />
              <span className="nf_piece" />
            </div>
          </div>

          <p className="nf_p404" data-depth="0.50">
            404
          </p>
          <p className="nf_p404" data-depth="0.10">
            404
          </p>
        </div>

        {/* ── Text ── */}
        <div className="nf_text">
          <article>
            <p>
              Uh oh! Looks like you got lost. <br />
              Go back to the homepage
            </p>
            <button onClick={() => navigate("/")}>Back To Home Page</button>
          </article>
        </div>
      </div>
    </section>
  );
}
