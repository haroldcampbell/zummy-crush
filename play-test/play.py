#!/usr/bin/env python3
import argparse
import os
import subprocess
import sys


def resolve_repo_root() -> str:
    script_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.abspath(os.path.join(script_dir, os.pardir))


def resolve_app_dir(repo_root: str, target: str) -> str:
    if target in ("main", "root"):
        return os.path.join(repo_root, "app")
    worktree_app = os.path.join(repo_root, ".worktrees", target, "app")
    return worktree_app


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Run a local play-test server for a specific agent worktree."
    )
    parser.add_argument(
        "target",
        help="Agent worktree name (e.g. agent-1) or 'main' for the root repo.",
    )
    parser.add_argument("--port", type=int, default=5173, help="Port to serve on.")
    parser.add_argument("--host", default="localhost", help="Host to bind to.")
    args = parser.parse_args()

    repo_root = resolve_repo_root()
    app_dir = resolve_app_dir(repo_root, args.target)

    if not os.path.isdir(app_dir):
        print(f"App directory not found: {app_dir}", file=sys.stderr)
        return 1

    print(f"Serving {args.target} from: {app_dir}")
    print(f"Open: http://{args.host}:{args.port}/client/")
    try:
        subprocess.run(
            ["python3", "-m", "http.server", str(args.port), "--bind", args.host],
            cwd=app_dir,
            check=True,
        )
    except KeyboardInterrupt:
        return 0
    except subprocess.CalledProcessError as exc:
        return exc.returncode
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
