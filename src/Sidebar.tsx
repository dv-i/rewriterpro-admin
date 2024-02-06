import { UsersIcon } from "@heroicons/react/24/outline";

const navigation = [
	{ name: "Users", href: "#", icon: UsersIcon, count: "5", current: true },
];

function classNames(...classes: string[]): any {
	return classes.filter(Boolean).join(" ");
}

export default function Example() {
	return (
		<div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6">
			<div className="flex h-16 shrink-0 items-center">
				<img
					className="h-8 w-auto"
					src="https://rewriterpro.ai/static/media/logo.13b4a77830f3267f0b7f.png"
					alt="RewriterPro.ai Admin"
				/>
			</div>
			<nav className="flex flex-1 flex-col">
				<ul role="list" className="flex flex-1 flex-col gap-y-7">
					<li>
						<ul role="list" className="-mx-2 space-y-1">
							{navigation.map((item) => (
								<li key={item.name}>
									<a
										href={item.href}
										className={classNames(
											item.current
												? "bg-indigo-700 text-white"
												: "text-indigo-200 hover:text-white hover:bg-indigo-700",
											"group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
										)}
									>
										<item.icon
											className={classNames(
												item.current
													? "text-white"
													: "text-indigo-200 group-hover:text-white",
												"h-6 w-6 shrink-0"
											)}
											aria-hidden="true"
										/>
										{item.name}
									</a>
								</li>
							))}
						</ul>
					</li>
				</ul>
			</nav>
		</div>
	);
}
